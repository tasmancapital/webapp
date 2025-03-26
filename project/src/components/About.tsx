import React from 'react';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="section-padding bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="container-xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start md:items-center">
          <div className="relative">
            <h2 className="heading-lg relative z-10">
              A leading private investment firm focused on partnering with exceptional management teams
            </h2>
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent blur-2xl transform -skew-y-6"></div>
          </div>
          <div className="space-y-8">
            <p className="description-text text-white">
              Tasman Capital is a private investment firm focused on partnering with 
              exceptional management teams to build great businesses. We invest in 
              mid-market companies with enterprise values between A$50m and A$200m 
              that have strong market positions and opportunities for growth.
            </p>
            <p className="description-text text-white">
              We typically invest between A$20m and A$100m of equity in each transaction. 
              Our team works closely with management teams to develop and execute value 
              creation strategies, providing strategic guidance and operational support.
            </p>
            <div className="pt-4">
              <a
                href="#approach"
                className="group inline-flex items-center gap-3 px-8 py-3 text-base text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 backdrop-blur-sm"
              >
                <span>Learn about our approach</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;