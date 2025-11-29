"use client"
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Users, Clock, CheckCircle, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    level: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.level && formData.subject && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          level: "",
          subject: "",
          message: ""
        });
      }, 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      info: "socialwork@university.edu.ng",
      description: "Send us your questions anytime",
      color: "purple"
    },
    {
      icon: Phone,
      title: "Call Us",
      info: "+234 803 456 7890",
      description: "Mon-Fri, 9AM-5PM WAT",
      color: "green"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "Social Work Department, University of Lagos",
      description: "Akoka, Lagos, Nigeria",
      color: "blue"
    },
    {
      icon: Clock,
      title: "Office Hours",
      info: "Mon - Fri: 9:00 AM - 5:00 PM",
      description: "Closed on weekends & holidays",
      color: "yellow"
    }
  ];

  const excos = [
    {
      name: "Ezechukwu Naomi Onyinyechi",
      position: "President",
      email: "president@socialwork.ng",
      image: "EN"
    },
    {
      name: "Oluwafemi Philip Oreoluwa",
      position: "Vice President",
      email: "vp@socialwork.ng",
      image: "OO"
    },
    {
      name: "Joshua Joy Temitope",
      position: "General Secretary",
      email: "secretary@socialwork.ng",
      image: "JT"
    },
    {
      name: "Bamigboye Basirat Eniola",
      position: "Treasurer",
      email: "treasurer@socialwork.ng",
      image: "BE"
    }
  ];

  const socialLinks = [
    { icon: Instagram, link: "#", color: "bg-pink-500", label: "Instagram" },
    { icon: Facebook, link: "#", color: "bg-blue-600", label: "Facebook" },
    { icon: Twitter, link: "#", color: "bg-sky-500", label: "Twitter" },
    { icon: Linkedin, link: "#", color: "bg-blue-700", label: "LinkedIn" }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; border: string; text: string; icon: string } } = {
      purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600", icon: "bg-[#9179E0]" },
      blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", icon: "bg-blue-500" },
      green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-600", icon: "bg-green-500" },
      yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-600", icon: "bg-yellow-500" }
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-[#4a368f] to-[#9179E0] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl mb-6">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white tracking-wide">GET IN TOUCH</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help! Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const colors = getColorClasses(info.color);
              const Icon = info.icon;
              return (
                <div key={index} className={`${colors.bg} rounded-2xl border-2 ${colors.border} p-6 hover:shadow-xl transition-all`}>
                  <div className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className={`font-bold ${colors.text} mb-2`}>{info.info}</p>
                  <p className="text-sm text-gray-600">{info.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Form & Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll respond within 24 hours
              </p>

              {submitted ? (
                <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Level *
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none transition-colors"
                      >
                        <option value="">Select your level</option>
                        <option value="100">100 Level</option>
                        <option value="200">200 Level</option>
                        <option value="300">300 Level</option>
                        <option value="400">400 Level</option>
                        <option value="alumni">Alumni</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this about?"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Tell us more about your inquiry..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full py-4 bg-[#9179E0] text-white font-bold rounded-xl hover:bg-[#7E6BDB] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Executive Officers */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Executives</h2>
              <p className="text-gray-600 mb-8">
                Get in touch with our executive officers directly
              </p>

              <div className="space-y-4">
                {excos.map((exco, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#9179E0] hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#9179E0] to-[#7E6BDB] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {exco.image}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{exco.name}</h3>
                        <p className="text-sm text-[#9179E0] font-medium mb-1">{exco.position}</p>
                        <a
                          href={`mailto:${exco.email}`}
                          className="text-sm text-gray-600 hover:text-[#9179E0] transition-colors flex items-center gap-1"
                        >
                          <Mail className="w-4 h-4" />
                          {exco.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="mt-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#9179E0]" />
                  Follow Us on Social Media
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Stay updated with our latest news and activities
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.link}
                        aria-label={social.label}
                        className={`w-12 h-12 ${social.color} rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How can I join the Social Work Students Association?",
                answer: "All students enrolled in the Social Work program are automatically members. Simply register through our portal to access exclusive benefits."
              },
              {
                question: "How do I participate in quiz competitions?",
                answer: "Navigate to the Quiz Competition section, select an active quiz, register with your details, and start competing for prizes!"
              },
              {
                question: "Can I suggest new flashcard topics?",
                answer: "Absolutely! Send us your suggestions through this contact form or email our academic officer directly."
              },
              {
                question: "What are the office hours?",
                answer: "Our office is open Monday to Friday, 9:00 AM to 5:00 PM WAT. We're closed on weekends and public holidays."
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-[#9179E0] transition-colors group"
              >
                <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-[#9179E0] group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Us</h2>
          <div className="bg-gradient-to-br from-[#9179E0] to-[#7E6BDB] rounded-2xl h-96 flex items-center justify-center text-white">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-bold">Social Work Department</p>
              <p className="text-white/80">University of Lagos, Akoka, Lagos, Nigeria</p>
              <button className="mt-4 px-6 py-3 bg-white text-[#9179E0] font-bold rounded-xl hover:shadow-xl transition-all">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;