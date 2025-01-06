import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LineChart, Share2, TrendingUp, Users, Lightbulb, Cpu } from 'lucide-react';

function Services() {
  const services = [
    {
      title: 'Real-time Analytics',
      description:
        'Track your social media performance in real-time with comprehensive analytics and insights. Make data-driven decisions instantly.',
      icon: <LineChart size={48} />,
    },
    {
      title: 'Global Reach Analysis',
      description:
        'Understand your audience demographics and reach across different regions and platforms.',
      icon: <Share2 size={48} />,
    },
    {
      title: 'Growth Tracking',
      description:
        'Monitor your follower growth, engagement rates, and content performance over time.',
      icon: <TrendingUp size={48} />,
    },
    {
      title: 'Audience Insights',
      description:
        'Get detailed insights about your audience preferences, behaviors, and engagement patterns.',
      icon: <Users size={48} />,
    },
    {
      title: 'GPT-powered Insights',
      description:
        'Leverage AI to generate content ideas, optimize posting times, and improve engagement.',
      icon: <Lightbulb size={48} />,
    },
    {
      title: 'Smart Automation',
      description:
        'Automate your social media workflow with intelligent scheduling and posting features.',
      icon: <Cpu size={48} />,
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h5 className="text-primary text-uppercase">Our Services</h5>
          <h2 className="fw-bold">Empower Your Social Media Strategy</h2>
          <p className="text-muted">
            Discover our comprehensive suite of tools designed to enhance your social media presence
            and drive meaningful engagement.
          </p>
        </div>

        {/* Services Grid */}
        <div className="row gy-4">
          {services.map((service, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <div className="card shadow h-100 text-center p-4">
                <div className="text-primary mb-3">{service.icon}</div>
                <h5 className="card-title fw-bold">{service.title}</h5>
                <p className="card-text text-muted">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
