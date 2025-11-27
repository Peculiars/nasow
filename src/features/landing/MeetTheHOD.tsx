import { Mail, Phone, Award, GraduationCap, Calendar, MapPin, Quote } from "lucide-react";
import Image from "next/image";

const MeetTheHOD = () => {
  const hod = {
    name: "Prof. Samuel Adejoh",
    title: "Head of Department",
    department: "Social Work",
    image: "/assets/hod.png",
    education: [
      "PhD in Social Work, University of Lagos",
      "MSc in Clinical Social Work, University of Ibadan",
      "BSc in Social Work, Obafemi Awolowo University"
    ],
    specialization: "Community Development & Social Policy",
    yearsOfService: "15+ Years",
    email: "hod.socialwork@unilag.edu.ng",
    phone: "+234 803 456 7890",
    office: "Faculty of Social Sciences, Room 204",
    quote: "Social work is not just a profession; it's a calling to serve humanity with compassion, dignity, and unwavering commitment to justice.",
    achievements: [
      "Published 40+ research papers in international journals",
      "Recipient of UNILAG Excellence in Teaching Award 2022",
      "Principal Investigator on 5 major community development projects",
      "Member, National Association of Social Workers (NASW)"
    ],
    officeHours: "Monday - Friday: 10:00 AM - 3:00 PM"
  };

  return (
    <section className="py-16 md:py-24 bg-white font-inter w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center md:text-left mb-12">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-4">
            <div className="hidden md:block size-6 bg-green-500" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">
              Meet Our Head of Department
            </h2>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            Leading with vision, experience, and dedication to excellence in social work education
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl border-2 border-gray-100">
              <Image
                src={hod.image}
                alt={hod.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4a368f]/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{hod.name}</h3>
                <p className="text-lg md:text-xl font-semibold text-white/90 mb-1">{hod.title}</p>
                <p className="text-sm text-white/80">{hod.department} Department</p>
              </div>
            </div>

            <div className="bg-[#9179E0]/5 border-2 border-[#9179E0]/20 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#9179E0]" />
                Quick Contact
              </h4>
              <div className="space-y-3">
                <a
                  href={`mailto:${hod.email}`}
                  className="flex items-start gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors group"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all">{hod.email}</span>
                </a>
                <a
                  href={`tel:${hod.phone}`}
                  className="flex items-start gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors group"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{hod.phone}</span>
                </a>
                <div className="flex items-start gap-3 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{hod.office}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{hod.officeHours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div className="relative bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg">
              <Quote className="absolute top-6 left-6 w-10 h-10 text-[#9179E0]/20" />
              <p className="text-lg md:text-xl text-gray-700 italic leading-relaxed pl-8">
                "{hod.quote}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-[#9179E0]/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#9179E0]/10 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-[#9179E0]" />
                  </div>
                  <h4 className="font-bold text-gray-900">Specialization</h4>
                </div>
                <p className="text-gray-700 text-sm">{hod.specialization}</p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-[#9179E0]/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900">Experience</h4>
                </div>
                <p className="text-gray-700 text-sm">{hod.yearsOfService} in Academia</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 md:p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#9179E0]" />
                Academic Background
              </h4>
              <ul className="space-y-3">
                {hod.education.map((edu, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-[#9179E0] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 md:p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-[#9179E0]" />
                Notable Achievements
              </h4>
              <ul className="space-y-3">
                {hod.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#4a368f] rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-3">Need to Get in Touch?</h4>
              <p className="text-white/90 mb-6 leading-relaxed">
                The HOD's office is always open to students, staff, and visitors. Schedule an appointment or drop by during office hours.
              </p>
              <a
                href={`mailto:${hod.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4a368f] rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
              >
                <Mail className="w-5 h-5" />
                Send a Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetTheHOD;