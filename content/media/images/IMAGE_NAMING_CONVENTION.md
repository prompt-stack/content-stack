# Image Naming Convention

This document proposes a structured naming convention for images to ensure scalability, discoverability, and straightforward integration with data formats like JSON.

## 1. Proposed Schema

The proposed schema uses underscores (`_`) as delimiters for easy parsing.

**Pattern:**
`type_context_description_date.[ext]`

---

### Schema Components

*   **`type`** (Required)
    *   **Description:** The general category of the image.
    *   **Examples:** `screenshot`, `icon`, `logo`, `diagram`, `photo`, `asset`.

*   **`context`** (Required)
    *   **Description:** The application area, component, or page the image relates to.
    *   **Examples:** `header`, `inbox`, `user-profile`, `auth-flow`, `style-guide`.

*   **`description`** (Required)
    *   **Description:** A concise, kebab-case summary of the image's specific content.
    *   **Examples:** `mobile-view`, `dropdown-menu-open`, `empty-state`, `error-message`.

*   **`date`** (Optional)
    *   **Description:** The date of creation in `YYYYMMDD` format. Especially useful for time-sensitive assets like screenshots.
    *   **Example:** `20250718`.

---

## 2. JSON Representation

This naming convention allows for easy parsing of filenames into a structured JSON object, which can be used to create an asset manifest or for dynamic loading.

A filename like `screenshot_header_dropdown-open_20250718.png` would translate to:

```json
{
  "filename": "screenshot_header_dropdown-open_20250718.png",
  "path": "media/images/screenshot_header_dropdown-open_20250718.png",
  "type": "screenshot",
  "context": "header",
  "description": "dropdown-open",
  "date": "20250718",
  "extension": "png"
}
```

---

## 3. Suggestions for Existing Images

The current images appear to be screenshots with generated names. To align them with the new convention, they should be renamed. Since the content of the images is unknown, placeholders for `context` and `description` are provided below. Please replace them based on what each image displays.

| Current Filename | Suggested New Name Template |
| :--- | :--- |
| `SCR-20250718-scaj.png` | `screenshot_context_description_20250718.png` |
| `SCR-20250718-scjm.png` | `screenshot_context_description_20250718.png` |
| `SCR-20250718-scmo.jpeg`| `screenshot_context_description_20250718.jpeg`|
| `SCR-20250718-sdat.jpeg`| `screenshot_context_description_20250718.jpeg`|
| `SCR-20250718-sdct.jpeg`| `screenshot_context_description_20250718.jpeg`|
| `SCR-20250718-sdim.jpeg`| `screenshot_context_description_20250718.jpeg`|
| `SCR-20250718-sdjw.jpeg`| `screenshot_context_description_20250718.jpeg`|
| `SCR-20250718-sdlm.jpeg`| `screenshot_context_description_20250718.jpeg`|
| `SCR-20250718-sdng.png` | `screenshot_context_description_20250718.png` |
| `SCR-20250718-sdov.jpeg`| `screenshot_context_description_20250718.jpeg`|

**Action:** Please review each image and fill in the `context` (e.g., `inbox`, `header`) and `description` (e.g., `mobile-layout`, `user-card`) for each filename.
