import { ArrowRight, Mail, GraduationCap, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MeetOurLecturers = () => {
  const lecturers = [
    {
      id: 1,
      name: "Dr. Adeyinka Oladele",
      title: "Senior Lecturer",
      specialization: "Clinical Social Work & Mental Health",
      qualifications: "PhD, MSc, BSc",
      image: "/assets/img-car-3.png",
      email: "a.oladele@unilag.edu.ng",
      courses: ["SOW 322", "SOW 410"]
    },
    {
      id: 2,
      name: "Dr. Folake Taiwo",
      title: "Associate Professor",
      specialization: "Community Development & Social Policy",
      qualifications: "PhD, MSc",
      image:  "/assets/img-car-3.png",
      email: "f.taiwo@unilag.edu.ng",
      courses: ["SOW 214", "SOW 320"]
    },
    {
      id: 3,
      name: "Dr. Chukwudi Eze",
      title: "Lecturer I",
      specialization: "Social Work Research & Statistics",
      qualifications: "PhD, MSc, BSc",
      image:  "/assets/img-car-3.png",
      email: "c.eze@unilag.edu.ng",
      courses: ["SOW 213", "SOW 324"]
    },
    {
      id: 4,
      name: "Dr. Blessing Okoro",
      title: "Senior Lecturer",
      specialization: "Child Welfare & Family Social Work",
      qualifications: "PhD, MSc",
      image:  "/assets/img-car-3.png",
      email: "b.okoro@unilag.edu.ng",
      courses: ["SOW 212", "SOW 323"]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 font-inter w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center md:text-left mb-12">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-4">
            <div className="hidden md:block size-6 bg-green-500" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">
              Meet Our Lecturers
            </h2>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            Experienced professionals dedicated to shaping the next generation of social workers
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {lecturers.map((lecturer) => (
            <div
              key={lecturer.id}
              className="group bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#9179E0]/20 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <Image
                  src={lecturer.image}
                  alt={lecturer.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Link
                    href={`mailto:${lecturer.email}`}
                    className="flex items-center justify-center gap-2 w-full bg-white text-[#4a368f] px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </Link>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#9179E0] transition-colors">
                  {lecturer.name}
                </h3>
                <p className="text-sm text-[#9179E0] font-semibold mb-1">
                  {lecturer.title}
                </p>
                <p className="text-xs text-gray-500 font-medium mb-3">
                  {lecturer.qualifications}
                </p>

                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                    {lecturer.specialization}
                  </p>
                </div>


                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1.5">
                    {lecturer.courses.map((course, index) => (
                      <span
                        key={index}
                        className="text-xs font-semibold bg-[#9179E0]/10 text-[#9179E0] px-2 py-1 rounded"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/lecturers/${lecturer.id}`}
                  className="flex items-center justify-center gap-2 w-full text-gray-700 hover:text-[#9179E0] font-semibold text-sm py-2 transition-colors group/link"
                >
                  View Profile
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/lecturers"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#9179E0] hover:bg-[#7E6BDB] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <GraduationCap className="w-5 h-5" />
            View All Lecturers
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 py-10 px-6 bg-white rounded-2xl border-2 border-gray-100">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">20+</p>
            <p className="text-sm text-gray-600 font-medium">Expert Lecturers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">15+</p>
            <p className="text-sm text-gray-600 font-medium">Years Experience</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">50+</p>
            <p className="text-sm text-gray-600 font-medium">Courses Taught</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">100+</p>
            <p className="text-sm text-gray-600 font-medium">Research Papers</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetOurLecturers;