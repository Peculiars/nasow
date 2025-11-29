import { Heart, Users, Target, Award, BookOpen, Lightbulb, TrendingUp, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AboutUsPage = () => {
  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Compassion",
      description: "We lead with empathy and care for all individuals and communities we serve"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Unity",
      description: "Together we build a strong, supportive community of future social workers"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Excellence",
      description: "We strive for the highest standards in academics and professional practice"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation",
      description: "We embrace new ideas and creative solutions to social challenges"
    }
  ];

  const milestones = [
    {
      year: "1985",
      title: "Foundation",
      description: "NASOWS UNILAG chapter was established"
    },
    {
      year: "2000",
      title: "National Recognition",
      description: "Became one of the leading NASOWS chapters in Nigeria"
    },
    {
      year: "2015",
      title: "Community Impact",
      description: "Launched major community outreach programs"
    },
    {
      year: "2025",
      title: "Digital Innovation",
      description: "Pioneered digital learning resources for members"
    }
  ];

  const achievements = [
    {
      icon: <Award className="w-8 h-8" />,
      number: "15+",
      label: "Awards Won",
      color: "text-yellow-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: "500+",
      label: "Active Members",
      color: "text-blue-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      number: "30+",
      label: "Community Projects",
      color: "text-green-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      number: "98%",
      label: "Graduate Success Rate",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-inter">
      <section className="relative h-[400px] md:h-[500px] bg-[#4a368f] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4a368f] to-[#9179E0]" />
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/assets/about-hero.jpg"
            alt="NASOWS Community"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About NASOWS UNILAG
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              The National Association of Social Work Students (NASOWS) UNILAG Chapter - Empowering future social workers through education, community service, and professional development since 1985.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-baseline space-x-3 mb-4">
                <div className="size-6 bg-green-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-[#4a368f]">
                  Who We Are
                </h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  NASOWS UNILAG Chapter is the official student body representing all social work students at the University of Lagos. We are a vibrant community of passionate individuals committed to social justice, human rights, and community development.
                </p>
                <p>
                  As the premier organization for social work students in UNILAG, we bridge the gap between academic learning and practical application, preparing our members to become competent, ethical, and compassionate social work professionals.
                </p>
                <p>
                  Our chapter serves as a platform for networking, skill development, advocacy, and community engagement, ensuring that every member has the tools and support needed to excel in their academic journey and future careers.
                </p>
              </div>
            </div>

            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/assets/excos/group.png"
                alt="NASOWS Team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border-2 border-gray-100">
              <div className="w-16 h-16 bg-[#9179E0]/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-[#9179E0]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To provide a supportive, inclusive environment that fosters academic excellence, professional growth, and social responsibility among social work students. We aim to equip our members with the knowledge, skills, and values necessary to become effective change agents in society.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-[#4a368f] rounded-2xl p-8 md:p-10 shadow-lg text-white">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Our Vision
              </h3>
              <p className="text-white/90 leading-relaxed">
                To be the leading social work student organization in Nigeria, recognized for producing competent, ethical, and compassionate professionals who drive positive social change and contribute meaningfully to community development and national progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="size-6 bg-green-500" />
              <h2 className="text-3xl md:text-4xl font-bold text-[#4a368f]">
                Our Core Values
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 hover:border-[#9179E0]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-[#9179E0]/10 rounded-lg flex items-center justify-center mb-4 text-[#9179E0]">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="size-6 bg-green-500" />
              <h2 className="text-3xl md:text-4xl font-bold text-[#4a368f]">
                Our Journey
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four decades of excellence and impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="relative bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 hover:border-[#9179E0]/30 transition-all duration-300"
              >
                <div className="text-4xl font-bold text-[#9179E0] mb-3">
                  {milestone.year}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {milestone.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#4a368f] mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-gray-600">
              Measuring our success through meaningful achievements
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-gray-100 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 ${achievement.color}`}>
                  {achievement.icon}
                </div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {achievement.number}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {achievement.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;