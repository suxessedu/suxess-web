import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-[#2C2C2C] overflow-x-hidden">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <img src="/logo.jpeg" alt="Suxess" className="w-9 h-9 rounded-lg object-cover" />
          <span className="text-xl font-bold tracking-tight">suxess.</span>
        </div>
        <a 
          href="#waitlist" 
          className="px-5 py-2 bg-[#2C2C2C] text-white text-sm rounded-full font-semibold transition-all hover:scale-105 active:scale-95"
        >
          Join Waitlist
        </a>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="animate-fade-up">
          <h1 className="text-3xl md:text-5xl font-bold leading-[1.15] mb-5 font-display">
            Verified tutors, <span className="text-gray-400">right at your doorstep.</span>
          </h1>
          <p className="text-[15px] text-gray-500 mb-8 max-w-md leading-relaxed">
            Suxess matches your child with background-checked, qualified home tutors — tailored to their subjects, schedule, and learning goals.
          </p>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                   <img src={`/images/image${(i % 3) + 1}.png`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold">
              Trusted by <span className="text-[#4a6d1d]">Parents Across Nigeria</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#waitlist" className="px-6 py-3 bg-[#2C2C2C] text-white rounded-xl font-semibold text-sm text-center transition-all hover:shadow-lg hover:-translate-y-0.5">
              Join the Waitlist
            </a>
            {/* <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all hover:bg-gray-50">
              <div className="w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center text-[10px]">{"\u25B6"}</div>
              Watch video
            </button> */}
          </div>
        </div>

        <div className="relative animate-scale-in flex items-center justify-center">
             <img 
              src="/images/image1.png" 
              alt="Suxess 3D Illustration" 
              className="w-[85%] h-auto object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-500"
            />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">  
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Home tutors for every subject</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard 
            icon={"\uD83D\uDCD0"}
            title="Maths & Sciences" 
            desc="From primary maths to advanced physics — qualified tutors who make it click."
            color="#eef2ff"
            iconColor="#4f46e5"
          />
          <FeatureCard 
            icon={"\u270D\uFE0F"}
            title="English & Languages" 
            desc="Build strong reading, writing, and communication skills with expert guidance."
            color="#fff9f9"
            iconColor="#dc2626"
            isFeatured={true}
          />
          <FeatureCard 
            icon={"\uD83D\uDCBB"}
            title="Coding & Tech" 
            desc="Introduction to programming, web development, and digital skills for young learners."
            color="#ecfdf5"
            iconColor="#059669"
          />
          <FeatureCard 
            icon={"\uD83D\uDCDA"}
            title="Exam Preparation" 
            desc="Focused coaching for WAEC, JAMB, Common Entrance, and other key examinations."
            color="#fffbeb"
            iconColor="#d97706"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#FAFAFA] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">How it works</h2>
          <p className="text-gray-400 text-sm text-center mb-12 max-w-md mx-auto">Three simple steps to get your child learning with a trusted tutor</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard number="1" title="Submit a Request" desc="Tell us about your child — their grade, subjects, schedule, and where you live." />
            <StepCard number="2" title="Get Matched" desc="Our smart algorithm finds the best-fit tutors. Shortlist your favourites or let us choose." />
            <StepCard number="3" title="Start Learning" desc="Your verified tutor comes to your home. Track lessons and chat — all in the app." />
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
           <div className="flex items-center justify-center">
             <img src="/images/image2.png" alt="Education" className="w-[90%] h-auto object-contain drop-shadow-lg rounded-5" />
           </div>
           <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Why parents choose Suxess</h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-md">
                We bring qualified, trusted tutors straight to your home — so your child learns in the most comfortable environment.
              </p>
              
              <div className="space-y-6">
                 <WhyItem icon={"\uD83C\uDFAF"} title="Smart Tutor Matching" desc="Our algorithm matches your child with the best-fit tutor based on subjects, grade, and preferences." />
                 <WhyItem icon={"\uD83D\uDEE1\uFE0F"} title="Background-Checked Tutors" desc="Every tutor is identity-verified and vetted before they can teach on the platform." />
                 <WhyItem icon={"\uD83D\uDCF1"} title="All-in-One App" desc="Request a tutor, chat with them, track lessons, and get updates — all from the Suxess app." />
              </div>
           </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-[#2C2C2C] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
           <div className="relative z-10 max-w-xl mx-auto">
             <h2 className="text-2xl md:text-3xl font-bold mb-4">Get your child matched with a tutor.</h2>
             <p className="text-gray-400 text-sm mb-8">Join the waitlist and be among the first parents to experience smart, safe home tutoring.</p>
             
             <div className="bg-white/10 p-1.5 rounded-xl flex flex-col sm:flex-row gap-1.5 max-w-sm mx-auto mb-10">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent border-none px-5 py-3 flex-1 outline-none text-white text-sm placeholder-gray-500"
                />
                <button className="px-6 py-3 bg-[#FFD700] text-[#2C2C2C] rounded-lg font-bold text-sm whitespace-nowrap transition-transform hover:scale-105">
                  Notify Me
                </button>
             </div>
             
             {/* App Store Badges */}
             <p className="text-gray-500 text-xs mb-4">Coming soon on</p>
             <div className="flex justify-center items-center gap-4">
                <a href="#" className="transition-opacity hover:opacity-80">
                  <img src="/images/App store.svg" alt="Download on the App Store" className="h-10" />
                </a>
                <a href="#" className="transition-opacity hover:opacity-80">
                  <img src="/images/google-play-store.png" alt="Get it on Google Play" className="h-10" />
                </a>
             </div>
           </div>
           
           {/* Decorative - hidden for clean look */}
        </div>
      </section>

      <footer className="py-8 text-center text-gray-400 text-xs border-t border-gray-100 max-w-6xl mx-auto px-6">
        &copy; 2026 Suxess Limited. All rights reserved.
      </footer>

      {/* Embedded CSS for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-up { animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-scale-in { animation: scale-in 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .font-display { font-family: 'Outfit', sans-serif; }
      `}} />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color, iconColor, isFeatured }) => (
  <div 
    className={`p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 border ${isFeatured ? 'border-[#FFD700] bg-[#FFFDF5]' : 'border-transparent bg-white hover:bg-gray-50'}`}
  >
    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-5" style={{ backgroundColor: color, color: iconColor }}>
      {icon}
    </div>
    <h3 className="text-base font-bold mb-2">{title}</h3>
    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="text-center">
    <div className="w-10 h-10 rounded-full bg-[#FFD700] text-[#2C2C2C] font-bold text-sm flex items-center justify-center mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-base font-bold mb-2">{title}</h3>
    <p className="text-xs text-gray-500 leading-relaxed max-w-[240px] mx-auto">{desc}</p>
  </div>
);

const WhyItem = ({ icon, title, desc }) => (
  <div className="flex gap-4 group">
    <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform flex-shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold mb-1">{title}</h4>
      <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default LandingPage;
