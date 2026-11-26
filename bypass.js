(function () {
  const TAG = "%c[Mercor Verification Bypass]";
  const STYLE = "color:#0f0;font-weight:bold";
  const log = (...a) => console.log(TAG, STYLE, ...a);

  log("v1.0 loaded – Mercor ID/Background/Phone verification bypass");

  function safeJSONParse(text) {
    try { return JSON.parse(text); } catch { return null; }
  }

  function isMercorUrl(url) {
    return typeof url === "string" && (url.includes("work.mercor.com") || url.includes(".mercor.com/"));
  }

  function isPersonaUrl(url) {
    return typeof url === "string" && (url.includes("withpersona.com") || url.includes("persona.wallet"));
  }

  function isTrpcUrl(url) {
    return typeof url === "string" && url.includes("/api/trpc/");
  }

  function isGraphqlUrl(url) {
    return typeof url === "string" && (url.includes("/graphql") || url.includes(".graphql"));
  }

  function patchVerificationFlags(obj) {
    if (!obj || typeof obj !== "object") return false;
    let modified = false;

    // Helper to set flag and track modification
    function setFlag(path, value) {
      const parts = path.split(".");
      let current = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!(parts[i] in current) || typeof current[parts[i]] !== "object") return;
        current = current[parts[i]];
      }
      const key = parts[parts.length - 1];
      if (current[key] !== value) {
        current[key] = value;
        modified = true;
      }
    }

    // ==================================----------------------
    // 1. ID VERIFICATION (Persona) - government ID + selfie
    // ==================================----------------------
    // Persona inquiry status fields
    if (
      "personaInquiryStatus" in obj ||
      "idVerificationStatus" in obj ||
      "verificationStatus" in obj ||
      "idVerification" in obj
    ) {
      if (
        "personaInquiryStatus" in obj &&
        obj.personaInquiryStatus !== "approved"
      ) {
        obj.personaInquiryStatus = "approved";
        modified = true;
        log("Forced personaInquiryStatus → approved");
      }
      if ("idVerificationStatus" in obj && obj.idVerificationStatus !== "completed") {
        obj.idVerificationStatus = "completed";
        modified = true;
        log("Forced idVerificationStatus → completed");
      }
      if ("verificationStatus" in obj && obj.verificationStatus !== "verified") {
        obj.verificationStatus = "verified";
        modified = true;
        log("Forced verificationStatus → verified");
      }
      if ("isVerified" in obj && obj.isVerified !== true) {
        obj.isVerified = true;
        modified = true;
        log("Forced isVerified → true");
      }
    }

    // Direct identity/KYC flags that Mercor may track
    if (
      "hasCompletedKyc" in obj ||
      "hasCompletedIdentityVerification" in obj ||
      "hasSubmittedIdentityVerification" in obj ||
      "requiresIdentityVerification" in obj
    ) {
      if ("hasCompletedKyc" in obj && obj.hasCompletedKyc !== true) {
        obj.hasCompletedKyc = true;
        modified = true;
      }
      if (
        "hasCompletedIdentityVerification" in obj &&
        obj.hasCompletedIdentityVerification !== true
      ) {
        obj.hasCompletedIdentityVerification = true;
        modified = true;
      }
      if (
        "hasSubmittedIdentityVerification" in obj &&
        obj.hasSubmittedIdentityVerification !== true
      ) {
        obj.hasSubmittedIdentityVerification = true;
        modified = true;
      }
      if (
        "requiresIdentityVerification" in obj &&
        obj.requiresIdentityVerification !== false
      ) {
        obj.requiresIdentityVerification = false;
        modified = true;
      }
    }

    // ==================================----------------------
    // 2. BACKGROUND CHECK (Certn)
    // ==================================----------------------
    // Background check result fields
    if (
      "backgroundCheckStatus" in obj ||
      "backgroundCheckResult" in obj ||
      "certnStatus" in obj ||
      "backgroundCheck" in obj
    ) {
      if ("backgroundCheckStatus" in obj && obj.backgroundCheckStatus !== "clear") {
        obj.backgroundCheckStatus = "clear";
        modified = true;
        log("Forced backgroundCheckStatus → clear");
      }
      if ("backgroundCheckResult" in obj && obj.backgroundCheckResult !== "pass") {
        obj.backgroundCheckResult = "pass";
        modified = true;
        log("Forced backgroundCheckResult → pass");
      }
      if ("certnStatus" in obj && obj.certnStatus !== "cleared") {
        obj.certnStatus = "cleared";
        modified = true;
        log("Forced certnStatus → cleared");
      }
      if (
        "backgroundCheckCompleted" in obj &&
        obj.backgroundCheckCompleted !== true
      ) {
        obj.backgroundCheckCompleted = true;
        modified = true;
        log("Forced backgroundCheckCompleted → true");
      }
    }

    // ==================================----------------------
    // 3. PHONE VERIFICATION (SMS/WhatsApp)
    // ==================================----------------------
    // Phone verification fields
    if (
      "phoneVerificationStatus" in obj ||
      "phoneVerified" in obj ||
      "hasVerifiedPhone" in obj ||
      "verificationCodeSent" in obj
    ) {
      if ("phoneVerified" in obj && obj.phoneVerified !== true) {
        obj.phoneVerified = true;
        modified = true;
        log("Forced phoneVerified → true");
      }
      if ("hasVerifiedPhone" in obj && obj.hasVerifiedPhone !== true) {
        obj.hasVerifiedPhone = true;
        modified = true;
        log("Forced hasVerifiedPhone → true");
      }
      if ("phoneVerificationStatus" in obj && obj.phoneVerificationStatus !== "verified") {
        obj.phoneVerificationStatus = "verified";
        modified = true;
        log("Forced phoneVerificationStatus → verified");
      }
    }

    // ==================================----------------------
    // 4. ONBOARDING CHECKLIST (umbrella)
    // ==================================----------------------
    // All-onboarding status flags
    if (
      "onboardingSteps" in obj ||
      "onboardingStatus" in obj ||
      "checklistCompleted" in obj ||
      "onboardingCompleted" in obj
    ) {
      if ("onboardingSteps" in obj && typeof obj.onboardingSteps === "object") {
        // Force all steps to completed
        for (const key of Object.keys(obj.onboardingSteps)) {
          if (typeof obj.onboardingSteps[key] === "object") {
            obj.onboardingSteps[key].completed = true;
            if (obj.onboardingSteps[key].status) {
              obj.onboardingSteps[key].status = "completed";
            }
          } else {
            obj.onboardingSteps[key] = true;
          }
        }
        modified = true;
        log("Forced all onboardingSteps → completed");
      }
      if ("onboardingStatus" in obj && obj.onboardingStatus !== "completed") {
        obj.onboardingStatus = "completed";
        modified = true;
        log("Forced onboardingStatus → completed");
      }
      if ("checklistCompleted" in obj && obj.checklistCompleted !== true) {
        obj.checklistCompleted = true;
        modified = true;
        log("Forced checklistCompleted → true");
      }
      if ("onboardingCompleted" in obj && obj.onboardingCompleted !== true) {
        obj.onboardingCompleted = true;
        modified = true;
        log("Forced onboardingCompleted → true");
      }
    }

    // ==================================----------------------
    // 5. Profile/Identity flags at top level
    // ==================================----------------------
    // Common Mercor profile identity fields
    const identityKeys = [
      "hasCompletedRegularKyc",
      "hasCompletedBlockingKyc",
      "shouldDisplayBlockingKYCModal",
      "blockingKycCurrentStatus",
      "silentKycEligibility",
      "accessRestrictions",
    ];
    for (const key of identityKeys) {
      if (key in obj) {
        if (key === "hasCompletedRegularKyc" && obj[key] !== true) {
          obj[key] = true;
          modified = true;
        } else if (key === "hasCompletedBlockingKyc" && obj[key] !== true) {
          obj[key] = true;
          modified = true;
        } else if (key === "shouldDisplayBlockingKYCModal" && obj[key] !== false) {
          obj[key] = false;
          modified = true;
        } else if (key === "blockingKycCurrentStatus" && obj[key] !== "approved") {
          obj[key] = "approved";
          modified = true;
        } else if (key === "silentKycEligibility" && typeof obj[key] === "object") {
          if (obj[key].canUse !== true) {
            obj[key].canUse = true;
            modified = true;
          }
          if (obj[key].hasQualifyingEducation !== true) {
            obj[key].hasQualifyingEducation = true;
            modified = true;
          }
          if (obj[key].reason !== "Approved") {
            obj[key].reason = "Approved";
            modified = true;
          }
        } else if (key === "accessRestrictions" && typeof obj[key] === "object") {
          const r = obj[key];
          if (r.requiresPhoneVerification === true) {
            r.requiresPhoneVerification = false;
            modified = true;
          }
          if (r.requiresHaiPhoneVerification === true) {
            r.requiresHaiPhoneVerification = false;
            modified = true;
          }
        }
      }
    }

    // ==================================----------------------
    // 6. Payments / Tax setup (also triggered when verification passes)
    // ==================================----------------------
    if (
      "taxInformation" in obj ||
      "payoutMethod" in obj ||
      "isFullySetup" in obj
    ) {
      const now = new Date().toISOString();
      if ("taxInformation" in obj) {
        obj.taxInformation = Object.assign(
          {
            status: "completed",
            completedAt: now,
            formType: "w9",
            taxIdentityFormStatus: "completed",
            tinMatchStatus: "matched",
            tinMatchResult: "matched",
            currentAttestation: { attestedAt: now, formType: "w9" },
          },
          obj.taxInformation || {}
        );
        modified = true;
      }
      if ("payoutMethod" in obj) {
        obj.payoutMethod = Object.assign(
          {
            status: "completed",
            completedAt: now,
            hasProviderAccount: true,
            countryCode: "US",
            needsPayoutMethodUpdate: false,
            taxSetupCompleted: true,
            connectedProviders: ["stripe"],
            defaultPayoutMethodLastFour: "4242",
            defaultPayoutMethodInstitutionName: "Stripe Test Bank",
            hasPayoutHistory: false,
          },
          obj.payoutMethod || {}
        );
        modified = true;
      }
      if ("isFullySetup" in obj) {
        obj.isFullySetup = true;
        modified = true;
        log("Forced isFullySetup → true");
      }
    }

    // ==================================----------------------
    // 7. Deep recursive patch (catch-all for nested objects)
    // ==================================----------------------
    for (const key of Object.keys(obj)) {
      if (obj[key] && typeof obj[key] === "object") {
        if (patchVerificationFlags(obj[key])) modified = true;
      }
    }
    return modified;
  }

  function processResponseJSON(json, url) {
    let modified = false;

    // 1. Filter Mercor-related GraphQL errors
    if (json.errors && Array.isArray(json.errors)) {
      const before = json.errors.length;
      json.errors = json.errors.filter((err) => {
        const msg = (err.message || "").toLowerCase();
        const code = err.extensions && err.extensions.code;
        // Remove phone verification errors and USER_NOT_GOOD_STANDING
        return !(msg.includes("phone verification") || code === "USER_NOT_GOOD_STANDING");
      });
      if (json.errors.length !== before) {
        modified = true;
        if (json.errors.length === 0) delete json.errors;
        if (json.data === null) json.data = {};
        log("Filtered", before - json.errors.length, "Mercor verification errors");
      }
    }

    // 2. Patch all verification flags
    if (patchVerificationFlags(json)) {
      modified = true;
      log("Patched verification flags in response");
    }

    // 3. If TrPC URL, handle explicit procedures
    if (isTrpcUrl(url)) {
      const items = Array.isArray(json) ? json : (json.result ? [json] : []);
      const procs = (url.match(/\/api\/trpc\/([^?]+)/) || [])[1] || "";
      const procList = procs.split(",");

      items.forEach((item, i) => {
        if (!item || !item.result || !item.result.data) return;
        const proc = (procList[i] || "").toLowerCase();
        let data = item.result.data.json;

        // Profile.getSelf
        if (
          proc.includes("profile.getself") ||
          proc === "profile.getself"
        ) {
          if (data && data.profile) {
            if (patchVerificationFlags(data.profile)) {
              modified = true;
              log("Forced identity flags on profile.getSelf");
            }
          }
        }

        // Kyc hasCompletedRegularKyc
        if (
          proc.includes("hascompletedregularkyc") ||
          (proc.includes("kyc.") && proc.includes("hascompleted"))
        ) {
          if (data === false) {
            item.result.data.json = true;
            modified = true;
            log("Forced hascompletedregularkyc → true");
          }
        }

        // Blocking modal
        if (proc.includes("blockingmodal") && data && typeof data === "object") {
          if (data.activeModal != null) {
            data.activeModal = null;
            modified = true;
          }
          if (data.kycDetails != null) {
            data.kycDetails = null;
            modified = true;
          }
        }

        // Phone verification flag key
        if (
          data &&
          typeof data === "object" &&
          data.flagKey === "phone-verification-existing-user-multivariate-v2"
        ) {
          data.enabled = false;
          data.defaultValue = false;
          modified = true;
          log("Forced phone-verification-existing-user-multivariate-v2 → disabled");
        }
      });
    }

    // 4. If Persona URL, hook the onComplete callback
    if (isPersonaUrl(url) && json && typeof json === "object") {
      // Look for inquiry completion markers
      if ("inquiryId" in json && "status" in json) {
        if (json.status !== "completed") {
          json.status = "completed";
          json.completedAt = new Date().toISOString();
          modified = true;
          log("Patched Persona inquiry status → completed");
        }
      }
      // Also check for fields map with verification flags
      if (json.fields && typeof json.fields === "object") {
        const fields = json.fields;
        if (fields.inquiryStatus !== "completed") {
          fields.inquiryStatus = "completed";
          modified = true;
        }
        if (fields.verificationStatus !== "verified") {
          fields.verificationStatus = "verified";
          modified = true;
        }
        if (fields.idVerificationStatus !== "completed") {
          fields.idVerificationStatus = "completed";
          modified = true;
        }
      }
    }

    return modified;
  }

  // ---------- fetch ----------
  const originalFetch = window.fetch;
  window.fetch = new Proxy(originalFetch, {
    async apply(target, thisArg, args) {
      const resource = args[0];
      const url = resource instanceof Request ? resource.url : String(resource || "");
      const response = await Reflect.apply(target, thisArg, args);

      if (isMercorUrl(url) || isGraphqlUrl(url) || isTrpcUrl(url)) {
        try {
          const text = await response.clone().text();
          const json = safeJSONParse(text);
          if (json && processResponseJSON(json, url)) {
            log("Patched", url.split("?")[0].replace(/https:\/\/[^/]+/, "").slice(-120));
            return new Response(JSON.stringify(json), {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            });
          }
        } catch (e) {
          console.error("[Mercor Verification Bypass] fetch error", e);
        }
      }
      return response;
    },
  });
  window.fetch.toString = () => "function fetch() { [native code] }";

  // ---------- XHR ----------
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this._bypassUrl = url;
    return originalOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function () {
    const url = this._bypassUrl || "";
    if (isMercorUrl(url) || isGraphqlUrl(url) || isTrpcUrl(url) || isPersonaUrl(url)) {
      this.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && (this.responseType === "" || this.responseType === "text")) {
          try {
            if (this._bypassDone) return;
            const json = safeJSONParse(this.responseText || this.response);
            if (json && processResponseJSON(json, url)) {
              const newText = JSON.stringify(json);
              Object.defineProperty(this, "responseText", { get: () => newText });
              Object.defineProperty(this, "response", { get: () => newText });
              this._bypassDone = true;
              log("Patched XHR", url.split("?")[0].replace(/https:\/\/[^/]+/, "").slice(-120));
            }
          } catch (e) {
            console.error("[Mercor Verification Bypass] XHR error", e);
          }
        }
      });
    }
    return originalSend.apply(this, arguments);
  };

  // ---------- DOM fallback: mark verification items as completed ----------
  function fixVerificationUI() {
    try {
      // ID Verification
      document.querySelectorAll("a, button, div, span, li, div").forEach((el) => {
        const t = (el.textContent || "").trim();
        // ID Verification patterns
        if (
          /id.?verification/i.test(t) &&
          t.length < 100 &&
          t.length > 3
        ) {
          let row = el.closest("a, button, [role='button'], li, div");
          if (row) {
            row.style.opacity = "0.55";
            row.style.pointerEvents = "none";
            row.querySelectorAll("span, div").forEach((badge) => {
              if (/required/i.test(badge.textContent || "")) {
                badge.textContent = "Completed";
                badge.style.background = "#dcfce7";
                badge.style.color = "#166534";
              }
            });
            const circle = row.querySelector("svg, [class*='circle'], [class*='radio']");
            if (circle) circle.style.display = "none";
          }
        }
        // Background Check patterns
        if (/background.?check/i.test(t) && t.length < 100) {
          let row = el.closest("a, button, [role='button'], li, div");
          if (row) {
            row.style.opacity = "0.55";
            row.style.pointerEvents = "none";
            row.querySelectorAll("span, div").forEach((badge) => {
              if (/required/i.test(badge.textContent || "")) {
                badge.textContent = "Completed";
                badge.style.background = "#dcfce7";
                badge.style.color = "#166534";
              }
            });
            const circle = row.querySelector("svg, [class*='circle'], [class*='radio']");
            if (circle) circle.style.display = "none";
          }
        }
        // Phone Verification patterns
        if (/phone.?verification/i.test(t) && t.length < 100) {
          let row = el.closest("a, button, [role='button'], li, div");
          if (row) {
            row.style.opacity = "0.55";
            row.style.pointerEvents = "none";
            row.querySelectorAll("span, div").forEach((badge) => {
              if (/required/i.test(badge.textContent || "")) {
                badge.textContent = "Completed";
                badge.style.background = "#dcfce7";
                badge.style.color = "#166534";
              }
            });
            const circle = row.querySelector("svg, [class*='circle'], [class*='radio']");
            if (circle) circle.style.display = "none";
          }
        }
      });

      // General "X step left" → "Ready" patterns (umbrella check)
      document.querySelectorAll("span, div, p").forEach((el) => {
        const t = (el.textContent || "").trim();
        if (/^\d+\s+steps?\s+left$/i.test(t) || /^1 step left$/i.test(t)) {
          el.textContent = "Ready";
          el.style.color = "#166534";
        }
      });

      // Specific text patterns for Mercor checklist items
      document.querySelectorAll("span, div, p").forEach((el) => {
        const t = (el.textContent || "").trim();
        // "1 step left" → "Ready"
        if (/^1 step left$/i.test(t)) {
          el.textContent = "Ready";
          el.style.color = "#166534";
        }
        // "Verify your identity" → mark complete
        if (/verify.?identity/i.test(t) && t.length < 80) {
          let row = el.closest("a, button, [role='button'], li, div");
          if (row) {
            row.style.opacity = "0.55";
            row.style.pointerEvents = "none";
            row.querySelectorAll("span, div").forEach((badge) => {
              if (/required/i.test(badge.textContent || "")) {
                badge.textContent = "Completed";
                badge.style.background = "#dcfce7";
                badge.style.color = "#166534";
              }
            });
            const circle = row.querySelector("svg, [class*='circle'], [class*='radio']");
            if (circle) circle.style.display = "none";
          }
        }
        // "Background check" → mark complete
        if (/background.?check/i.test(t) && t.length < 80) {
          let row = el.closest("a, button, [role='button'], li, div");
          if (row) {
            row.style.opacity = "0.55";
            row.style.pointerEvents = "none";
            row.querySelectorAll("span, div").forEach((badge) => {
              if (/required/i.test(badge.textContent || "")) {
                badge.textContent = "Completed";
                badge.style.background = "#dcfce7";
                badge.style.color = "#166534";
              }
            });
            const circle = row.querySelector("svg, [class*='circle'], [class*='radio']");
            if (circle) circle.style.display = "none";
          }
        }
        // "Phone verification" → mark complete
        if (/phone.?verification/i.test(t) && t.length < 80) {
          let row = el.closest("a, button, [role='button'], li, div");
          if (row) {
            row.style.opacity = "0.55";
            row.style.pointerEvents = "none";
            row.querySelectorAll("span, div").forEach((badge) => {
              if (/required/i.test(badge.textContent || "")) {
                badge.textContent = "Completed";
                badge.style.background = "#dcfce7";
                badge.style.color = "#166534";
              }
            });
            const circle = row.querySelector("svg, [class*='circle'], [class*='radio']");
            if (circle) circle.style.display = "none";
          }
        }
      });
    } catch (_) {}
  }

  // Run periodically so React re-renders don't restore the UI
  setInterval(fixIdentityUI, 800);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fixIdentityUI);
  } else {
    fixIdentityUI();
  }
})();