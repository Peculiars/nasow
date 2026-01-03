"use server"

export async function submitContactForm(formData: {
  name: string
  email: string
  level: string
  subject: string
  message: string
}) {
  try {
    const formId = "1FAIpQLScl74ayH2Mgk-mN-NWAOFzUjxtYQEqbEGh9O7BgYjzEEY1I3Q"
    const baseUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`

    const formBody = new URLSearchParams()
    formBody.append("entry.2005620554", formData.name)
    formBody.append("entry.1045781291", formData.email)
    formBody.append("entry.1166974658", formData.level)
    formBody.append("entry.839337160", `Subject: ${formData.subject}\n\nMessage: ${formData.message}`)

    console.log("[v0] Submitting form to Google Forms")

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://docs.google.com/forms/d/e/" + formId + "/viewform",
      },
      body: formBody.toString(),
      redirect: "follow",
    })

    console.log("[v0] Google Forms response status:", response.status)

    // Google Forms returns 200 on success, but also may return on redirect
    // Any successful fetch without error means submission likely went through
    if (response.ok || response.status === 200) {
      console.log("[v0] Form submitted successfully")
      return { success: true }
    } else {
      const responseText = await response.text()
      console.log("[v0] Response status:", response.status, "Text:", responseText.substring(0, 200))
      return { success: false, error: `Server returned status ${response.status}` }
    }
  } catch (error) {
    console.error("[v0] Form submission error:", error)
    return { success: false, error: "Failed to submit form. Please try again." }
  }
}