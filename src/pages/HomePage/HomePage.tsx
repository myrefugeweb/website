import React from 'react';
import { Header } from '../../components/Header';
import { HeroSection } from '../../components/HeroSection';
import { StatsSection } from '../../components/StatsSection';
import { MissionSection } from '../../components/MissionSection';
import { StorySection } from '../../components/StorySection';
import { DonationBanner } from '../../components/DonationBanner';
import { HelpSection } from '../../components/HelpSection';
import { ImpactSection } from '../../components/ImpactSection';
import { SparrowsClosetSection } from '../../components/SparrowsClosetSection';
import { SponsorsSection } from '../../components/SponsorsSection';
import { CalendarSection } from '../../components/CalendarSection';
import { ContactSection } from '../../components/ContactSection';
import { Footer } from '../../components/Footer';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <div id="about">
          <MissionSection />
        </div>
        <StorySection />
        <DonationBanner />
        <div id="ways-to-give">
          <HelpSection />
        </div>
        <ImpactSection />
        <SparrowsClosetSection />
        <SponsorsSection />
        <CalendarSection />
        <div id="contact">
          <ContactSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

