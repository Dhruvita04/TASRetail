  # TAS Token Tagging Flow Design

  ## 1. Overview

  This document describes the user-driven TAS token tagging flow with a React frontend and backend service, aligned to the existing TAS naming style (`/rebind/...`).

  ### Key design points
  - The consent link boots a **secure, short-lived session**.
  - **Card details are fetched from the issuer during session initialization**, so a separate mandatory card API is not required.
  - **OTP is mandatory before the merchant list is shown**.
  - All user-facing calls after session init are **session-bound**.
  - The existing `TAS_REBIND_DETAIL_A1`, `TAS_TOKEN_DETAIL_A1`, `TAS_TOKEN_LOG_A1`, and `TAS_NOTIFICATION_DETAILS` tables remain the core business and audit backbone, with session state persisted in `TAS_RETAIL_SESSION_A1` and OTP state in `TAS_OTP_SESSION_A1`.
  - After OTP and merchant selection, the backend can publish the rebind payload to Kafka for async batch processing.

  ---

  ## 2. Session-based flow

  ### Recommended lifecycle
  1. User opens the consent link.
  2. Backend validates the signed link and creates a secure session.
  3. Backend fetches issuer card summary during session initialization.
  4. Backend sends OTP.
  5. User verifies OTP.
  6. Backend returns the merchant list.
  7. User selects merchants/tokens.
  8. Backend initiates ACS / 2FA if applicable.
  9. Backend pushes the rebind payload to Kafka for batch processing.
  10. Batch consumer updates token status and notification status.
  11. FE polls session status until completion.

  ### Session rules
  - The consent link must be **signed** and **expiring**.
  - Each session must be bound to one `tas_rebindid`.
  - All customer actions after session init must require the session token (Bearer) and `tas_rebindid` header.
  - Session expiration, link replay, and OTP lockout must be enforced.

  ---

  ## 3. Customer-facing APIs

  > These are the customer-facing APIs for the session-based token tagging flow.

  ### API 1 — Initialize session from consent link

  **Method:** `POST`

  **Path:** `/rebind/session/init`

  **Purpose:**
  - Validate the consent link token.
  - Create or resume a secure session.
  - Fetch masked card summary from the issuer.
  - Return the next step.

  **Request**
  ```json
  {
    "consent_link_token": "signed-consent-token"
  }
  ```

  **Response**
  ```json
  {
    "tas_rebindid": "RB24000123",
    "session_status": "OTP_SEND",
    "masked_card_number": "XXXX-XXXX-XXXX-1234",
    "card_holder_name": "A KUMAR",
    "issuer_name": "ABC Bank"
  }
  ```

  **Errors**
  - `INVALID_LINK`
  - `LINK_EXPIRED`
  ---

  [//]: # (### API 2 — Send OTP)

  [//]: # ()
  [//]: # (**Method:** `POST`)

  [//]: # ()
  [//]: # (**Path:** `/rebind/session/otp/send`)

  [//]: # ()
  [//]: # (**Purpose:**)

  [//]: # (- Send OTP to the user before merchant list access.)

  [//]: # ()
  [//]: # (**Request**)

  [//]: # (```json)

  [//]: # ({)

  [//]: # (  "tas_sessionid": "SSN10001",)

  [//]: # (  "channel": "SMS")

  [//]: # (})

  [//]: # (```)

  [//]: # ()
  [//]: # (**Response**)

  [//]: # (```json)

  [//]: # ({)

  [//]: # (  "tas_rebindid": "RB24000123",)

  [//]: # (  "tas_sessionid": "SSN10001",)

  [//]: # (  "otp_status": "SENT",)

  [//]: # (  "masked_destination": "XXXXXX1234",)

  [//]: # (  "expires_in_seconds": 300,)

  [//]: # (  "resend_after_seconds": 30,)

  [//]: # (  "remaining_attempts": 3)

  [//]: # (})

  [//]: # (```)

  [//]: # ()
  [//]: # (**Errors**)

  [//]: # (- `SESSION_EXPIRED`)

  [//]: # (- `OTP_RATE_LIMITED`)

  [//]: # (- `OTP_ALREADY_VERIFIED`)

  [//]: # (- `OTP_SEND_FAILED`)

  [//]: # ()
  [//]: # (**Notes**)

  [//]: # (- OTP send must be idempotent within the resend cooldown window.)

  [//]: # (- No merchant list should be returned before OTP verification.)

  [//]: # ()
  [//]: # (---)

  ### API 3 — Verify OTP

  **Method:** `POST`

  **Path:** `/rebind/session/otp/verify`

  **Purpose:**
  - Verify the OTP and unlock the merchant list step.

  **Request**
  ```json
  {
    "tas_rebindid": "RB24000123",
    "otp": "483921"
  }
  ```

  **Response**
  ```json
  {
    "tas_rebindid": "tasabcd1234567",
    "masked_card": "XXXXXXXXXXXX0374",
    "token" : {
      "session_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 900
    },
    "session_status": "AUTHENTICATED",
    "createdon": "2026-09-22T14:02:00+05:30"
  }
  ```

  **Errors**
  - `OTP_INVALID`
  - `OTP_EXPIRED`
  - `OTP_LOCKED`
  - `SESSION_EXPIRED`

  **Notes**
  - After successful verification, the session becomes eligible to fetch the merchant list.
  - Lock the session after too many failed attempts.

  ---

  ### API 4 — Resend OTP

  **Method:** `POST`

  **Path:** `/rebind/session/otp/resend`

  **Purpose:**
  - Resend OTP after cooldown / retry eligibility.

  **Request**
  ```json
  {
    "tas_rebindid": "RB24000123"
  }
  ```

  **Response**
  ```json
  {
    "tas_rebindid": "RB24000123",
    "session_status": "OTP_SEND",
    "masked_card_number": "XXXX-XXXX-XXXX-1234",
    "card_holder_name": "A KUMAR",
    "issuer_name": "ABC Bank",
    "resend_after_seconds": 30,
    "remaining_attempts": 2
  }
  ```

  **Errors**
  - `OTP_RESEND_TOO_SOON`
  - `OTP_MAX_RESEND_REACHED`
  - `SESSION_EXPIRED`

  ---

  ### API 5 — Fetch merchant list

  **Method:** `POST`

  **Path:** `/rebind/session/merchant-list`

  **Purpose:**
  - Fetch the merchant/token list only after OTP verification.

  **Headers**
  ```http
  Authorization: Bearer <session-cookie-or-session-token>
  ```

  **Request**
  ```json
  {
    "tas_rebindid": "RB24000123"
  }
  ```

  **Response**
  ```json
  {
    "tas_rebindid": "RB24000123",
    "rebind_status": "MERCHANT_LIST_READY",
    "tokens": [
      {
        "merchant_name": "Amazon",
        "tur": "TUR001"
      },
      {
        "merchant_name": "Flipkart",
        "tur": "TUR002"
      }
    ]
  }
  ```

  **Errors**
  - `SESSION_EXPIRED`
  - `RECORD_NOT_FOUND`
  - `INVALID_TOKEN`


  [//]: # (### API 6 — Submit merchant selection)

  [//]: # ()
  [//]: # (**Method:** `POST`)

  [//]: # ()
  [//]: # (**Path:** `/rebind/session/merchant-selection`)

  [//]: # ()
  [//]: # (**Purpose:**)

  [//]: # (- Capture the customer-selected merchants/tokens for further processing.)

  [//]: # (- Persist customer consent at token level.)

  [//]: # (- Return the next step.)

  [//]: # ()
  [//]: # (**Request**)

  [//]: # (```json)

  [//]: # ({)

  [//]: # (  "tas_sessionid": "SSN10001",)

  [//]: # (  "selected_tokens": [)

  [//]: # (    {)

  [//]: # (      "tokenid": "TK1001",)

  [//]: # (      "tur": "TUR001")

  [//]: # (    },)

  [//]: # (    {)

  [//]: # (      "tokenid": "TK1002",)

  [//]: # (      "tur": "TUR002")

  [//]: # (    })

  [//]: # (  ])

  [//]: # (})

  [//]: # (```)

  [//]: # ()
  [//]: # (**Response**)

  [//]: # (```json)

  [//]: # ({)

  [//]: # (  "tas_rebindid": "RB24000123",)

  [//]: # (  "tas_sessionid": "SSN10001",)

  [//]: # (  "selected_token_count": 2,)

  [//]: # (  "rebind_status": "MERCHANT_SELECTION_CAPTURED",)

  [//]: # (  "next_step": "ACS_AUTHENTICATION_INITIATE")

  [//]: # (})

  [//]: # (```)

  [//]: # ()
  [//]: # (**Errors**)

  [//]: # (- `SESSION_EXPIRED`)

  [//]: # (- `OTP_NOT_VERIFIED`)

  [//]: # (- `INVALID_TOKEN_SELECTION`)

  [//]: # (- `NO_TOKEN_SELECTED`)

  [//]: # ()
  [//]: # (**Notes**)

  [//]: # (- Only tokens returned by API 5 for the same session may be selected.)

  [//]: # (- This API should be idempotent for the same selection payload.)

  [//]: # ()
  [//]: # (---)

  ### API 7 — Initiate 2FA authentication

  **Method:** `POST`

  **Path:** `/rebind/session/2fa/initiate`

  **Purpose:**
  - Initiate ACS / 2FA challenge for the selected tokens if required.
  - Return challenge details or redirect metadata.

  **Request**
  ```json
  {
    "tokens": [
      {
        "merchant_name": "Amazon",
        "tur": "TUR001"
      },
      {
        "merchant_name": "Flipkart",
        "tur": "TUR002"
      }
    ]
  }
  ```

  **Response**
  ```json
  {
    "tas_rebindid": "RB24000123",
    "session_status": "AUTHENTICATION_PENDING"
  }
  ```

  **Errors**
  - `SESSION_EXPIRED`
  - `2FA_FAILED`

  [//]: # (### API 8 — Fetch ACS authentication status)

  [//]: # ()
  [//]: # (**Method:** `GET`)

  [//]: # ()
  [//]: # (**Path:** `/rebind/session/acs/authenticate/status`)

  [//]: # ()
  [//]: # (**Purpose:**)

  [//]: # (- Allow FE to poll the ACS / 2FA result.)

  [//]: # (- Return whether the customer can proceed to processing.)

  [//]: # ()
  [//]: # (**Headers**)

  [//]: # (```http)

  [//]: # (Authorization: Bearer <session-cookie-or-session-token>)

  [//]: # (```)

  [//]: # ()
  [//]: # (**Response**)

  [//]: # (```json)

  [//]: # ({)

  [//]: # (  "tas_rebindid": "RB24000123",)

  [//]: # (  "tas_sessionid": "SSN10001",)

  [//]: # (  "challenge_id": "CHL10001",)

  [//]: # (  "acs_status": "SUCCESS",)

  [//]: # (  "next_step": "PROCESS_REBIND")

  [//]: # (})

  [//]: # (```)

  [//]: # ()
  [//]: # (**Errors**)

  [//]: # (- `SESSION_EXPIRED`)

  [//]: # (- `2FA_FAILED`)


  [//]: # (**Notes**)

  [//]: # (- FE should poll this API after redirect or embedded ACS completion.)

  [//]: # (- If ACS fails, the flow should not proceed to Kafka publish.)

  [//]: # ()
  [//]: # (---)

  [//]: # (### API 9 — Process rebind)

  [//]: # ()
  [//]: # (**Method:** `POST`)

  [//]: # ()
  [//]: # (**Path:** `/rebind/session/process`)

  [//]: # ()
  [//]: # (**Purpose:**)

  [//]: # (- Publish the approved rebind payload to Kafka for batch processing.)

  [//]: # (- Mark the rebind as queued for async execution.)

  [//]: # ()
  [//]: # (**Request**)

  [//]: # (```json)

  [//]: # ({)

  [//]: # (  "tas_sessionid": "SSN10001")

  [//]: # (})

  [//]: # (```)

  [//]: # ()
  [//]: # (**Response**)

  [//]: # (```json)

  [//]: # ({)

  [//]: # (  "tas_rebindid": "RB24000123",)

  [//]: # (  "tas_sessionid": "SSN10001",)

  [//]: # (  "rebind_status": "QUEUED",)

  [//]: # (  "kafka_publish_status": "SUCCESS",)

  [//]: # (  "next_step": "SESSION_STATUS")

  [//]: # (})

  [//]: # (```)

  [//]: # (**Errors**)

  [//]: # (- `SESSION_EXPIRED`)

  [//]: # (- `ACS_NOT_COMPLETED`)

  [//]: # (- `NO_TOKEN_SELECTED`)

  [//]: # (- `KAFKA_PUBLISH_FAILED`)

  [//]: # ()
  [//]: # (**Notes**)

  [//]: # (- This API should be idempotent so duplicate user clicks do not publish duplicate Kafka messages.)

  [//]: # (- Batch processing begins only after this API succeeds.)

  [//]: # ()
  [//]: # (---)

  ### API 10 — Fetch session status

  **Method:** `POST`

  **Path:** `/rebind/session/status`

  **Purpose:**
  - Return the current end-to-end progress for the active session.
  - Support FE polling, resume, and refresh.

  **Headers**
  ```http
  Authorization: Bearer <session-token>
  ```

  **Response**
  ```json
  {
    "tas_rebindid": "RB24000123",
    "session_status": "2FA_IN_PROGRESS"
  }
  ```

  **Errors**
  - `SESSION_EXPIRED`

  **Notes**
  - This is the primary FE polling API after the async stage begins.

  ---

  [//]: # (### API 11 — Fetch final result)

  [//]: # ()
  [//]: # (**Method:** `GET`)

  [//]: # ()
  [//]: # (**Path:** `/rebind/session/result`)

  [//]: # ()
  [//]: # (**Purpose:**)

  [//]: # (- Return the final tagging outcome for the session.)

  [//]: # (- Provide token-level success/failure summary for the result screen.)

  [//]: # ()
  [//]: # (**Headers**)

  [//]: # (```http)

  [//]: # (Authorization: Bearer <session-cookie-or-session-token>)

  [//]: # (```)

  [//]: # ()
  [//]: # (**Response**)

  [//]: # (```json)

  [//]: # ({)

  [//]: # (  "tas_rebindid": "RB24000123",)

  [//]: # (  "tas_sessionid": "SSN10001",)

  [//]: # (  "rebind_status": "COMPLETED",)

  [//]: # (  "notification_status": "SENT",)

  [//]: # (  "successful_tokens": [)

  [//]: # (    {)

  [//]: # (      "tokenid": "TK1001",)

  [//]: # (      "merchant_name": "Amazon",)

  [//]: # (      "status": "SUCCESS")

  [//]: # (    },)

  [//]: # (    {)

  [//]: # (      "tokenid": "TK1002",)

  [//]: # (      "merchant_name": "Flipkart",)

  [//]: # (      "status": "SUCCESS")

  [//]: # (    })

  [//]: # (  ],)

  [//]: # (  "failed_tokens": [])

  [//]: # (})

  **Errors**
  - `SESSION_EXPIRED`
  - `RESULT_NOT_READY`
  - `SESSION_NOT_FOUND`

  **Notes**
  - If the flow ends with partial failures, `failed_tokens` should be populated with token-level error context.
  - FE should call this API only after status indicates terminal completion.

  ---

## 4. Table changes implemented

### 4.1 `TAS_REBIND_DETAIL_A1` — current structure

This table continues to hold the rebind-level business record.

**Current columns retained**
- Link metadata remains in `CONSENT_LINK` and `CONSENT_LINK_EXPIRY`.
- Rebind lifecycle continues to be tracked through `STATUS` and the existing error columns.
- No additional journey/session columns have been added to this table in the current schema revision.

**Design note**
- Detailed retail journey state is now stored in `TAS_RETAIL_SESSION_A1` instead of expanding the parent rebind table.

**Why**
- `TAS_REBIND_DETAIL_A1` remains focused on the rebind business record.
- Session-level state can evolve independently in the retail-session child table.

---

### 4.2 `TAS_TOKEN_DETAIL_A1` — implemented updates

This table is the token-level lifecycle table and should also store user selection / 2FA / processing markers.

**Columns added in current schema**
- `TWO_FA_STATUS VARCHAR(20)`
- `RETRY_COUNT INT`
- `SESSION_ID VARCHAR(64)`

**Current usage**
- `TWO_FA_STATUS` stores token-level 2FA/AFA progression.
- `RETRY_COUNT` supports retry-aware processing.
- `SESSION_ID` provides linkage back to the retail journey context.

**Why**
- Keep token processing and 2FA state explicit.
- Session linkage improves traceability for the user-driven flow.

---

### 4.3 `TAS_TOKEN_LOG_A1` — implemented updates

This table should continue to be the audit/log backbone, but it should also capture session context.

**Columns added in current schema**
- `SESSIONID VARCHAR(64)`
- `SESSION_STATUS VARCHAR(30)`

**Why**
- The token log now captures both token progression and its associated retail journey session status.
- Session-based audit is helpful for troubleshooting and fraud review.

---

### 4.4 `TAS_NOTIFICATION_DETAILS` — current structure

This table should track final notifications and retries more cleanly.

**Current columns retained**
- `NOTIFICATIONID`
- `SOURCEID`
- `TAS_REBINDID`
- `PAR`
- `RETRY_COUNT`
- `RETRY_DATE`
- `STATUS`
- `CREATEDON`
- `CREATEDBY`

**Design note**
- No new notification metadata columns have been added yet in the current schema revision.

**Why**
- The existing notification table still supports basic final-status tracking.
- Additional delivery/error attributes can be added in a future migration if FE or retry logic needs them.

---

## 5. New tables added

### 5.1 `TAS_RETAIL_SESSION_A1`

This table has been added as the retail journey child table for the rebind flow.

**Purpose**
- Track browser/session state for one rebind journey.

**Columns added**
- `SESSION_ID VARCHAR(64)` primary key
- `SESSION_TOKEN_HASH VARCHAR(256)`
- `TAS_REBINDID VARCHAR(20)` foreign key
- `JOURNEY_STATUS VARCHAR(30)`
- `LINK_STATUS VARCHAR(20)`
- `OTP_STATUS VARCHAR(20)`
- `OTP_SENT_ON TIMESTAMP`
- `OTP_VERIFIED_ON TIMESTAMP`
- `SELECTED_TOKEN_COUNT INT`
- `AFA_STATUS VARCHAR(20)`
- `AFA_REFERENCE_ID VARCHAR(50)`
- `SEND_TO_KAFKA VARCHAR(20)`
- `RETAIL_ERROR_CODE VARCHAR(20)`
- `RETAIL_ERROR_DESC VARCHAR(200)`
- `DEVICE_FINGERPRINT VARCHAR(200)`
- `CLIENT_IP VARCHAR(64)`
- `USER_AGENT VARCHAR(500)`
- `CREATEDON TIMESTAMP`
- `EXPIRES_ON TIMESTAMP`
- `CREATEDBY VARCHAR(20)`
- `MODIFIEDON TIMESTAMP`
- `MODIFIEDBY VARCHAR(20)`

**Why**
- The full customer journey must be session-based.
- This protects the flow from link sharing and session hijacking.
- It keeps OTP, AFA, and Kafka handoff state in one retail-journey child record.

---

### 5.2 `TAS_OTP_SESSION_A1`

**Purpose**
- Keep OTP lifecycle separate from rebind and session state.

**Columns added**
- `OTP_SESSION_ID VARCHAR(64)` primary key
- `SESSION_ID VARCHAR(64)`
- `TAS_REBINDID VARCHAR(20)`
- `STATUS VARCHAR(20)`
- `CHANNEL VARCHAR(10)`
- `OTP_MASK VARCHAR(6)`
- `SENT_ON TIMESTAMP`
- `EXPIRES_ON TIMESTAMP`
- `VERIFY_ATTEMPT_COUNT INT`
- `RESEND_COUNT INT`
- `CREATEDON TIMESTAMP`
- `CREATEDBY VARCHAR(20)`
- `MODIFIEDON TIMESTAMP`
- `MODIFIEDBY VARCHAR(20)`

**Why**
- OTP has its own lifecycle and retry rules.
- Makes resend, verification attempt tracking, and expiry easier to manage.

---

## 6. Existing reference tables

These tables do not need major structural changes for the first release, but they remain important for validation and lookups:

- `TAS_SOURCE_MASTER`
- `TAS_CLIENT_MASTER`
- `TAS_SOURCE_CLIENT_MASTER`
- `TAS_ISSUER_MASTER`
- `TAS_BIN_MASTER`
- `TAS_TSP_MASTER`
- `TAS_TSP_ADDITIONAL_MASTER`
- `TAS_ERRORCODE_MASTER`
- `TAS_TABLE_SUFFIX`

---

## 7. Recommended implementation summary

### FE
- React app with route guards and session-based pages.
- Merchant list must not load until OTP is verified.
- Poll session status during async processing.

### Backend
- Validate signed consent link.
- Create a secure session.
- Fetch issuer card summary during session init.
- Send/verify OTP.
- Expose merchant list only after OTP success.
- Push the rebind payload to Kafka after user confirmation / 2FA.

### Database
- Keep rebind/token tables as the business backbone.
- Add `TAS_RETAIL_SESSION_A1` for retail journey state and `TAS_OTP_SESSION_A1` for OTP lifecycle state.
- Add session linkage and token-level retry/2FA metadata to support progress tracking and idempotency.

---

## 8. Final note

The cleanest design is:
- **one signed consent link**
- **one session per journey**
- **OTP before merchant list**
- **session-bound customer APIs**
- **existing rebind/token tables for persistence and audit, with retail session and OTP child tables for journey control**
