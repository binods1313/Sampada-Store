// pages/about.js 
import React from 'react';
import Image from 'next/image';
import { client } from '../lib/sanity';
import { groq } from 'next-sanity';
import styles from '../styles/About.module.css';
import { PortableText } from '@portabletext/react';
import SanityImage from '../components/SanityImage';

// Query to fetch all about page content from Sanity
const aboutPageQuery = groq`*[_type == "aboutUs"][0]{
  title,
  heroTitle,
  heroDescription,
  missionTitle,
  missionDescription,
  teamTitle,
  teamMembers[] {
    name,
    position,
    image
  },
  storyTitle,
  storyContent,
  storyImage,
  statsTitle,
  statsDescription,
  stats[] {
    value,
    label
  },
  contactTitle,
  contactDescription
}`;

export async function getStaticProps() {
  const aboutData = await client.fetch(aboutPageQuery);
  
  return {
    props: {
      aboutData
    },
    revalidate: 60, // Revalidate every minute for any content changes
  };
}

const AboutPage = ({ aboutData }) => {
  if (!aboutData) return <div>Loading...</div>;

  return (
    <>
      {/* Hero Section */}
       <div className={styles.heroSection}>
       <div className={styles.heroContent}>
       <h1 className={styles.heroBackground}>PEACE</h1>
       <h2 className={styles.heroTitle}>{aboutData.heroTitle || "Building the Future, Now"}</h2>
         <p className={styles.heroDescription}>
           {aboutData.heroDescription || 
        "At Binod Tech Ventures, we don't just build innovative products—we craft transformative solutions that redefine the digital landscape and shape the future.\n\n" +
        "Our unwavering passion for technology, creativity, and excellence fuels our mission to turn visionary ideas into groundbreaking realities. With a deep commitment to pushing boundaries, we harness the power of cutting-edge advancements.\n\n" +
        "To design seamless experiences that inspire, connect, and empower individuals and businesses alike. Whether it's revolutionizing industries through intelligent automation, enhancing connectivity with state-of-the-art systems, or pioneering user-centric designs.\n\n" +
        "That make life easier, we are dedicated to innovation that makes a lasting impact. Every day, we strive to push the limits of possibility, ensuring that our solutions not only meet the needs of today.\n\n" +
        "But pave the way for a smarter, more efficient, and truly extraordinary tomorrow. At Binod Tech Ventures, the future isn't just something we anticipate—it's something we actively build."
        }
        </p>
        </div>
        </div>

      {/* Mission Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{aboutData.missionTitle || "Our Mission"}</h2>
          <p className={styles.sectionText}>
            {aboutData.missionDescription || 
              "Our mission is to empower businesses and individuals with transformative, cutting-edge tech solutions. We are dedicated to pushing the boundaries of innovation while building lasting partnerships grounded in trust, precision, and excellence."}
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className={`${styles.section} ${styles.valuesSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>Innovation</h3>
              <p className={styles.valueText}>
                We constantly push the boundaries of what's possible, exploring new technologies and developing products that transform the way you interact with the world.
              </p>
            </div>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>Quality</h3>
              <p className={styles.valueText}>
                We're committed to excellence in every product we offer, ensuring unparalleled performance, durability, and user experience.
              </p>
            </div>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>Sustainability</h3>
              <p className={styles.valueText}>
                Our dedication to responsible innovation means creating products that not only enhance human capabilities but also minimize environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{aboutData.storyTitle || "Our Journey of Innovation"}</h2>
          
          {aboutData.storyContent ? (
            <div className={styles.storyContent}>
              <PortableText value={aboutData.storyContent} />
            </div>
          ) : (
            <>
              <p className={styles.sectionText}>
                Founded with a bold vision and a relentless drive for innovation, Binod Tech Ventures began as a small startup fueled by big ideas. 
                Over the years, we have grown into a leading force in the tech industry, continually challenging the status quo and setting new benchmarks for excellence.
              </p>
              <p className={styles.sectionText}>
                Our journey is a story of passion, collaboration, and a commitment to transforming challenges into opportunities. 
                Today, we celebrate our achievements and look ahead to a future filled with limitless possibilities. 
                Join us as we continue to pioneer breakthroughs that reshape the digital landscape.
              </p>
            </>
          )}
          
          {/* Team Photo */}
          <div className={styles.teamImageContainer}>
            {aboutData.storyImage ? (
              <SanityImage 
                image={aboutData.storyImage}
                alt="Team members of Binod Tech Ventures"
                className={styles.teamImage}
                width={800}
                height={600}
              />
            ) : (
              <img 
                src="/team-photo.jpg" 
                alt="Team members of Binod Tech Ventures" 
                className={styles.teamImage}
              />
            )}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`${styles.section} ${styles.teamSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{aboutData.teamTitle || "Meet Our Visionaries"}</h2>
          <div className={styles.teamGrid}>
            {aboutData.teamMembers && aboutData.teamMembers.length > 0 ? (
              aboutData.teamMembers.map((member, index) => (
                <div key={index} className={styles.teamMember}>
                  {member.image ? (
                    <SanityImage 
                      image={member.image}
                      alt={`${member.name} photo`}
                      className={styles.memberPhoto}
                      width={300}
                      height={300}
                    />
                  ) : (
                    <img 
                      src={`/team/${member.name.toLowerCase().replace(/\s+/g, '-')}.jpg`} 
                      alt={`${member.name} photo`}
                      className={styles.memberPhoto} 
                    />
                  )}
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.position}</p>
                </div>
              ))
            ) : (
              // Fallback team members if none are provided in CMS
              <>
                <div className={styles.teamMember}>
                  <img 
                    src="/team/akshay.jpg" 
                    alt="Team member photo" 
                    className={styles.memberPhoto} 
                  />
                  <h3 className={styles.memberName}>Akshay</h3>
                  <p className={styles.memberRole}>Chief Technology Officer</p>
                </div>
                <div className={styles.teamMember}>
                  <img 
                    src="/team/srini.jpg" 
                    alt="Team member photo" 
                    className={styles.memberPhoto} 
                  />
                  <h3 className={styles.memberName}>Srini</h3>
                  <p className={styles.memberRole}>Chief Operating Officer</p>
                </div>
                <div className={styles.teamMember}>
                  <img 
                    src="/team/mahesh.jpg" 
                    alt="Team member photo" 
                    className={styles.memberPhoto} 
                  />
                  <h3 className={styles.memberName}>Mahesh</h3>
                  <p className={styles.memberRole}>Chief Operating Officer</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{aboutData.statsTitle || "Our Impact"}</h2>
          <p className={styles.sectionText}>
            {aboutData.statsDescription || 
              "We measure our success by the difference we create. From innovative projects to satisfied clients, every achievement is a milestone on our journey to redefine technology."}
          </p>
          
          <div className={styles.statsGrid}>
            {aboutData.stats && aboutData.stats.length > 0 ? (
              aboutData.stats.map((stat, index) => (
                <div key={index} className={styles.statCard}>
                  <h3 className={styles.statNumber}>{stat.value}</h3>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              ))
            ) : (
              // Fallback stats if none are provided in CMS
              <>
                <div className={styles.statCard}>
                  <h3 className={styles.statNumber}>100+</h3>
                  <p className={styles.statLabel}>Projects Delivered</p>
                </div>
                <div className={styles.statCard}>
                  <h3 className={styles.statNumber}>50+</h3>
                  <p className={styles.statLabel}>Happy Clients</p>
                </div>
                <div className={styles.statCard}>
                  <h3 className={styles.statNumber}>10+</h3>
                  <p className={styles.statLabel}>Years of Innovation</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className={`${styles.section} ${styles.connectSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{aboutData.contactTitle || "Connect With Us"}</h2>
          <p className={styles.sectionText}>
            {aboutData.contactDescription || 
              "We'd love to hear from you. Whether you have a question, an idea, or simply want to get in touch, reach out and let's create something extraordinary together."}
          </p>
          <button className={styles.contactButton}>Contact Our Team</button>
        </div>
      </section>
    </>
  );
};

export default AboutPage;