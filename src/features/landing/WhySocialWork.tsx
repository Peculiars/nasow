import { reasons } from '@/src/Data';
import { Heart, Scale, Sparkles, Users, TrendingUp, Target } from 'lucide-react';

const WhySocialWork = () => {

  return (
    <div className="w-full bg-white py-16 px-4 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-[#392971] mb-4">
            Why Social Work?
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Social Work isn't just what we study, it's who we are. We learn, serve, and make real impact where it matters most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="bg-blue-600 rounded-2xl p-8 text-white hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <Icon className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhySocialWork;