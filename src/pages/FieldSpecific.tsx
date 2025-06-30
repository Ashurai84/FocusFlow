import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Stethoscope, Palette, Calculator, BookOpen, GraduationCap, Youtube, ExternalLink, Heart, Settings as Lungs, Brain, Eye, Ear, Plus, Minus, Divide, X, Equal, Trash2, Save, Download, DollarSign, TrendingUp, PieChart, BarChart3, Activity, Zap, Microscope, Atom } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export function FieldSpecific() {
  const { user } = useAuthStore();
  const [selectedField, setSelectedField] = useState<string>(
    user?.field.toLowerCase() || 'engineering'
  );

  const fields = [
    { id: 'engineering', name: 'Engineering', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { id: 'medical', name: 'Medical', icon: Stethoscope, color: 'from-red-500 to-pink-500' },
    { id: 'arts', name: 'Arts', icon: Palette, color: 'from-purple-500 to-indigo-500' },
    { id: 'commerce', name: 'Commerce', icon: Calculator, color: 'from-green-500 to-emerald-500' },
    { id: 'science', name: 'Science', icon: BookOpen, color: 'from-orange-500 to-yellow-500' },
    { id: 'general', name: 'General', icon: GraduationCap, color: 'from-gray-500 to-slate-500' }
  ];

  const renderFieldContent = () => {
    switch (selectedField) {
      case 'engineering':
        return <EngineeringContent />;
      case 'medical':
        return <MedicalContent />;
      case 'arts':
        return <ArtsContent />;
      case 'commerce':
        return <CommerceContent />;
      case 'science':
        return <ScienceContent />;
      default:
        return <GeneralContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Field Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white text-center mb-6">Field Specific Tools</h1>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {fields.map((field) => {
              const IconComponent = field.icon;
              return (
                <motion.button
                  key={field.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedField(field.id)}
                  className={`p-4 rounded-xl text-white transition-all ${
                    selectedField === field.id
                      ? 'bg-white/30 scale-105 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <IconComponent size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-medium">{field.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Field Content */}
        <motion.div
          key={selectedField}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderFieldContent()}
        </motion.div>
      </div>
    </div>
  );
}

// Engineering Content with 100+ abbreviations
function EngineeringContent() {
  const [selectedCategory, setSelectedCategory] = useState('channels');

  const channels = [
    { name: 'Apna College', url: 'https://www.youtube.com/@ApnaCollegeOfficial', subscribers: '4.2M', description: 'Complete programming courses' },
    { name: 'CodeWithHarry', url: 'https://www.youtube.com/@CodeWithHarry', subscribers: '4.8M', description: 'Web development tutorials' },
    { name: 'Dhruv Rathee', url: 'https://www.youtube.com/@DhruvRathee', subscribers: '25M', description: 'Tech explanations & analysis' },
    { name: 'Gate Smashers', url: 'https://www.youtube.com/@GateSmashers', subscribers: '1.2M', description: 'GATE exam preparation' },
    { name: 'Jenny\'s Lectures', url: 'https://www.youtube.com/@JennyslecturesCSIT', subscribers: '1.8M', description: 'Computer science concepts' },
    { name: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', subscribers: '5.2M', description: 'Mathematical concepts visually' },
    { name: 'Computerphile', url: 'https://www.youtube.com/@Computerphile', subscribers: '2.1M', description: 'Computer science topics' },
    { name: 'MIT OpenCourseWare', url: 'https://www.youtube.com/@mitocw', subscribers: '4.8M', description: 'MIT lectures & courses' }
  ];

  const abbreviations = [
    // Programming & Software
    { short: 'API', full: 'Application Programming Interface' },
    { short: 'SDK', full: 'Software Development Kit' },
    { short: 'IDE', full: 'Integrated Development Environment' },
    { short: 'GUI', full: 'Graphical User Interface' },
    { short: 'CLI', full: 'Command Line Interface' },
    { short: 'OOP', full: 'Object Oriented Programming' },
    { short: 'SQL', full: 'Structured Query Language' },
    { short: 'HTML', full: 'HyperText Markup Language' },
    { short: 'CSS', full: 'Cascading Style Sheets' },
    { short: 'JS', full: 'JavaScript' },
    { short: 'JSON', full: 'JavaScript Object Notation' },
    { short: 'XML', full: 'eXtensible Markup Language' },
    { short: 'HTTP', full: 'HyperText Transfer Protocol' },
    { short: 'HTTPS', full: 'HyperText Transfer Protocol Secure' },
    { short: 'FTP', full: 'File Transfer Protocol' },
    { short: 'SSH', full: 'Secure Shell' },
    { short: 'VPN', full: 'Virtual Private Network' },
    { short: 'DNS', full: 'Domain Name System' },
    { short: 'IP', full: 'Internet Protocol' },
    { short: 'TCP', full: 'Transmission Control Protocol' },
    { short: 'UDP', full: 'User Datagram Protocol' },
    { short: 'URL', full: 'Uniform Resource Locator' },
    { short: 'URI', full: 'Uniform Resource Identifier' },
    { short: 'REST', full: 'Representational State Transfer' },
    { short: 'SOAP', full: 'Simple Object Access Protocol' },
    
    // Database & Data
    { short: 'DBMS', full: 'Database Management System' },
    { short: 'RDBMS', full: 'Relational Database Management System' },
    { short: 'NoSQL', full: 'Not Only SQL' },
    { short: 'CRUD', full: 'Create, Read, Update, Delete' },
    { short: 'ETL', full: 'Extract, Transform, Load' },
    { short: 'BI', full: 'Business Intelligence' },
    { short: 'DW', full: 'Data Warehouse' },
    { short: 'ML', full: 'Machine Learning' },
    { short: 'AI', full: 'Artificial Intelligence' },
    { short: 'NLP', full: 'Natural Language Processing' },
    { short: 'CV', full: 'Computer Vision' },
    { short: 'DL', full: 'Deep Learning' },
    { short: 'NN', full: 'Neural Network' },
    { short: 'CNN', full: 'Convolutional Neural Network' },
    { short: 'RNN', full: 'Recurrent Neural Network' },
    
    // Hardware & Systems
    { short: 'CPU', full: 'Central Processing Unit' },
    { short: 'GPU', full: 'Graphics Processing Unit' },
    { short: 'RAM', full: 'Random Access Memory' },
    { short: 'ROM', full: 'Read Only Memory' },
    { short: 'SSD', full: 'Solid State Drive' },
    { short: 'HDD', full: 'Hard Disk Drive' },
    { short: 'USB', full: 'Universal Serial Bus' },
    { short: 'HDMI', full: 'High Definition Multimedia Interface' },
    { short: 'PCB', full: 'Printed Circuit Board' },
    { short: 'IC', full: 'Integrated Circuit' },
    { short: 'FPGA', full: 'Field Programmable Gate Array' },
    { short: 'ASIC', full: 'Application Specific Integrated Circuit' },
    { short: 'RISC', full: 'Reduced Instruction Set Computer' },
    { short: 'CISC', full: 'Complex Instruction Set Computer' },
    { short: 'ALU', full: 'Arithmetic Logic Unit' },
    { short: 'CU', full: 'Control Unit' },
    { short: 'MMU', full: 'Memory Management Unit' },
    { short: 'DMA', full: 'Direct Memory Access' },
    { short: 'BIOS', full: 'Basic Input Output System' },
    { short: 'UEFI', full: 'Unified Extensible Firmware Interface' },
    
    // Software Engineering
    { short: 'SDLC', full: 'Software Development Life Cycle' },
    { short: 'AGILE', full: 'Adaptive Software Development' },
    { short: 'SCRUM', full: 'Iterative Development Framework' },
    { short: 'CI/CD', full: 'Continuous Integration/Continuous Deployment' },
    { short: 'DevOps', full: 'Development Operations' },
    { short: 'QA', full: 'Quality Assurance' },
    { short: 'QC', full: 'Quality Control' },
    { short: 'TDD', full: 'Test Driven Development' },
    { short: 'BDD', full: 'Behavior Driven Development' },
    { short: 'MVC', full: 'Model View Controller' },
    { short: 'MVP', full: 'Model View Presenter' },
    { short: 'MVVM', full: 'Model View ViewModel' },
    { short: 'SPA', full: 'Single Page Application' },
    { short: 'PWA', full: 'Progressive Web Application' },
    { short: 'SaaS', full: 'Software as a Service' },
    { short: 'PaaS', full: 'Platform as a Service' },
    { short: 'IaaS', full: 'Infrastructure as a Service' },
    
    // Networking & Security
    { short: 'LAN', full: 'Local Area Network' },
    { short: 'WAN', full: 'Wide Area Network' },
    { short: 'WLAN', full: 'Wireless Local Area Network' },
    { short: 'WiFi', full: 'Wireless Fidelity' },
    { short: 'MAC', full: 'Media Access Control' },
    { short: 'DHCP', full: 'Dynamic Host Configuration Protocol' },
    { short: 'NAT', full: 'Network Address Translation' },
    { short: 'VPN', full: 'Virtual Private Network' },
    { short: 'SSL', full: 'Secure Sockets Layer' },
    { short: 'TLS', full: 'Transport Layer Security' },
    { short: 'PKI', full: 'Public Key Infrastructure' },
    { short: 'RSA', full: 'Rivest Shamir Adleman' },
    { short: 'AES', full: 'Advanced Encryption Standard' },
    { short: 'DES', full: 'Data Encryption Standard' },
    { short: 'SHA', full: 'Secure Hash Algorithm' },
    { short: 'MD5', full: 'Message Digest 5' },
    { short: 'CSRF', full: 'Cross Site Request Forgery' },
    { short: 'XSS', full: 'Cross Site Scripting' },
    { short: 'SQL Injection', full: 'Structured Query Language Injection' },
    { short: 'DoS', full: 'Denial of Service' },
    { short: 'DDoS', full: 'Distributed Denial of Service' },
    
    // Electronics & Electrical
    { short: 'AC', full: 'Alternating Current' },
    { short: 'DC', full: 'Direct Current' },
    { short: 'EMF', full: 'Electromotive Force' },
    { short: 'PCB', full: 'Printed Circuit Board' },
    { short: 'LED', full: 'Light Emitting Diode' },
    { short: 'LCD', full: 'Liquid Crystal Display' },
    { short: 'OLED', full: 'Organic Light Emitting Diode' },
    { short: 'PWM', full: 'Pulse Width Modulation' },
    { short: 'ADC', full: 'Analog to Digital Converter' },
    { short: 'DAC', full: 'Digital to Analog Converter' },
    { short: 'Op-Amp', full: 'Operational Amplifier' },
    { short: 'BJT', full: 'Bipolar Junction Transistor' },
    { short: 'FET', full: 'Field Effect Transistor' },
    { short: 'MOSFET', full: 'Metal Oxide Semiconductor Field Effect Transistor' },
    { short: 'JFET', full: 'Junction Field Effect Transistor' },
    { short: 'SCR', full: 'Silicon Controlled Rectifier' },
    { short: 'TRIAC', full: 'Triode for Alternating Current' },
    { short: 'DIAC', full: 'Diode for Alternating Current' },
    { short: 'UJT', full: 'Unijunction Transistor' },
    { short: 'PUT', full: 'Programmable Unijunction Transistor' }
  ];

  const diagrams = [
    {
      title: 'Software Architecture Patterns',
      description: 'Common architectural patterns in software engineering',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'
    },
    {
      title: 'Network Topology Diagrams',
      description: 'Different network configurations and structures',
      imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop'
    },
    {
      title: 'Database Schema Design',
      description: 'Entity relationship diagrams and database structures',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
      title: 'Circuit Diagrams',
      description: 'Electronic circuit schematics and layouts',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { id: 'channels', name: 'YouTube Channels', icon: Youtube },
            { id: 'abbreviations', name: 'Abbreviations', icon: Code },
            { id: 'diagrams', name: 'Diagrams', icon: Activity }
          ].map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-white/30 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <IconComponent size={18} className="mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content based on selected category */}
      {selectedCategory === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel, index) => (
            <motion.a
              key={index}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 hover:bg-white/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg group-hover:text-blue-200 transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-white/60 text-sm">{channel.subscribers} subscribers</p>
                </div>
                <ExternalLink size={20} className="text-white/60 group-hover:text-white transition-colors" />
              </div>
              <p className="text-white/80 text-sm">{channel.description}</p>
            </motion.a>
          ))}
        </div>
      )}

      {selectedCategory === 'abbreviations' && (
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-white font-semibold text-xl mb-4">Engineering Abbreviations (100+)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {abbreviations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex justify-between items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
              >
                <span className="text-white font-medium text-sm">{item.short}</span>
                <span className="text-white/70 text-xs flex-1 ml-3">{item.full}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {selectedCategory === 'diagrams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diagrams.map((diagram, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/30 transition-all"
            >
              <img
                src={diagram.imageUrl}
                alt={diagram.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-2">{diagram.title}</h3>
                <p className="text-white/80 text-sm">{diagram.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Medical Content with enhanced features
function MedicalContent() {
  const [selectedSystem, setSelectedSystem] = useState('cardiovascular');
  const [selectedCategory, setSelectedCategory] = useState('systems');
  
  const bodySystems = {
    cardiovascular: {
      name: 'Cardiovascular System',
      icon: Heart,
      fullForms: [
        { short: 'ECG/EKG', full: 'Electrocardiogram' },
        { short: 'BP', full: 'Blood Pressure' },
        { short: 'MI', full: 'Myocardial Infarction' },
        { short: 'CHF', full: 'Congestive Heart Failure' },
        { short: 'CAD', full: 'Coronary Artery Disease' },
        { short: 'PVD', full: 'Peripheral Vascular Disease' },
        { short: 'DVT', full: 'Deep Vein Thrombosis' },
        { short: 'PE', full: 'Pulmonary Embolism' },
        { short: 'AF', full: 'Atrial Fibrillation' },
        { short: 'VT', full: 'Ventricular Tachycardia' }
      ],
      facts: [
        'Heart beats ~100,000 times per day',
        'Blood travels 60,000 miles through vessels',
        'Heart pumps 2,000 gallons of blood daily',
        'Heart has 4 chambers: 2 atria, 2 ventricles',
        'Cardiac output: 5-6 liters per minute'
      ],
      diagram: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
    },
    respiratory: {
      name: 'Respiratory System',
      icon: Lungs,
      fullForms: [
        { short: 'COPD', full: 'Chronic Obstructive Pulmonary Disease' },
        { short: 'ABG', full: 'Arterial Blood Gas' },
        { short: 'TB', full: 'Tuberculosis' },
        { short: 'URI', full: 'Upper Respiratory Infection' },
        { short: 'ARDS', full: 'Acute Respiratory Distress Syndrome' },
        { short: 'OSA', full: 'Obstructive Sleep Apnea' },
        { short: 'PFT', full: 'Pulmonary Function Test' },
        { short: 'FEV1', full: 'Forced Expiratory Volume in 1 second' },
        { short: 'FVC', full: 'Forced Vital Capacity' },
        { short: 'PEEP', full: 'Positive End Expiratory Pressure' }
      ],
      facts: [
        'We breathe ~20,000 times per day',
        'Lungs contain 300-500 million alveoli',
        'Surface area of lungs = tennis court',
        'Right lung has 3 lobes, left has 2',
        'Diaphragm is the main breathing muscle'
      ],
      diagram: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop'
    },
    nervous: {
      name: 'Nervous System',
      icon: Brain,
      fullForms: [
        { short: 'CNS', full: 'Central Nervous System' },
        { short: 'PNS', full: 'Peripheral Nervous System' },
        { short: 'CSF', full: 'Cerebrospinal Fluid' },
        { short: 'EEG', full: 'Electroencephalogram' },
        { short: 'MRI', full: 'Magnetic Resonance Imaging' },
        { short: 'CT', full: 'Computed Tomography' },
        { short: 'TBI', full: 'Traumatic Brain Injury' },
        { short: 'CVA', full: 'Cerebrovascular Accident (Stroke)' },
        { short: 'MS', full: 'Multiple Sclerosis' },
        { short: 'ALS', full: 'Amyotrophic Lateral Sclerosis' }
      ],
      facts: [
        'Brain has ~86 billion neurons',
        'Nerve signals travel at 268 mph',
        'Brain uses 20% of body\'s energy',
        'Spinal cord is 18 inches long',
        'Brain weighs about 3 pounds'
      ],
      diagram: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
    }
  };

  const channels = [
    { name: 'Osmosis', url: 'https://www.youtube.com/@osmosis', subscribers: '2.1M', description: 'Medical education videos' },
    { name: 'Armando Hasudungan', url: 'https://www.youtube.com/@ArmandoHasudungan', subscribers: '1.8M', description: 'Medical illustrations' },
    { name: 'Khan Academy Medicine', url: 'https://www.youtube.com/@khanacademymedicine', subscribers: '1.2M', description: 'Medical concepts explained' },
    { name: 'Ninja Nerd', url: 'https://www.youtube.com/@NinjaNerdOfficial', subscribers: '2.5M', description: 'Detailed medical lectures' },
    { name: 'Dr. Najeeb Lectures', url: 'https://www.youtube.com/@DoctorNajeeb', subscribers: '1.9M', description: 'Basic medical sciences' },
    { name: 'Lecturio Medical', url: 'https://www.youtube.com/@LecturioMedical', subscribers: '800K', description: 'USMLE preparation' }
  ];

  const currentSystem = bodySystems[selectedSystem as keyof typeof bodySystems];
  const IconComponent = currentSystem.icon;

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { id: 'systems', name: 'Body Systems', icon: Heart },
            { id: 'channels', name: 'YouTube Channels', icon: Youtube },
            { id: 'diagrams', name: 'Medical Diagrams', icon: Activity }
          ].map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-white/30 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <IconComponent size={18} className="mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {selectedCategory === 'systems' && (
        <>
          {/* System Selector */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xl mb-4">Body Systems</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(bodySystems).map(([key, system]) => {
                const SystemIcon = system.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedSystem(key)}
                    className={`p-4 rounded-lg transition-all ${
                      selectedSystem === key
                        ? 'bg-white/30 text-white scale-105'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <SystemIcon size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-medium">{system.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <IconComponent className="text-red-400 mr-3" size={24} />
                <h3 className="text-white font-semibold text-xl">{currentSystem.name}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-white/80 font-medium mb-3">Medical Abbreviations</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {currentSystem.fullForms.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
                        <span className="text-white font-medium text-sm">{item.short}</span>
                        <span className="text-white/70 text-xs flex-1 ml-3">{item.full}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white/80 font-medium mb-3">Quick Facts</h4>
                  <div className="space-y-2">
                    {currentSystem.facts.map((fact, index) => (
                      <div key={index} className="p-2 bg-white/10 rounded-lg">
                        <span className="text-white/80 text-sm">{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-2xl overflow-hidden">
              <img
                src={currentSystem.diagram}
                alt={`${currentSystem.name} diagram`}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h4 className="text-white font-semibold mb-2">{currentSystem.name} Diagram</h4>
                <p className="text-white/80 text-sm">Visual representation of the {currentSystem.name.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedCategory === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel, index) => (
            <motion.a
              key={index}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 hover:bg-white/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg group-hover:text-red-200 transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-white/60 text-sm">{channel.subscribers} subscribers</p>
                </div>
                <ExternalLink size={20} className="text-white/60 group-hover:text-white transition-colors" />
              </div>
              <p className="text-white/80 text-sm">{channel.description}</p>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}

// Arts Content (keeping existing canvas functionality)
function ArtsContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(3);

  const colors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
    '#ff69b4', '#32cd32', '#ff4500', '#9370db', '#20b2aa'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'artwork.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Palette className="text-purple-400 mr-3" size={24} />
            <h3 className="text-white font-semibold text-xl">Digital Canvas</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={saveCanvas}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors flex items-center"
            >
              <Save size={16} className="mr-1" />
              Save
            </button>
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors flex items-center"
            >
              <Trash2 size={16} className="mr-1" />
              Clear
            </button>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full border border-white/30 rounded-lg cursor-crosshair bg-gray-800"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-white/80 text-sm mb-2 block">Color Palette</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    currentColor === color ? 'border-white scale-110 shadow-lg' : 'border-white/30'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-white/80 text-sm mb-2 block">Brush Size: {brushSize}px</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Commerce Content (keeping existing calculator)
function CommerceContent() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const goldenRules = [
    'Assets = Liabilities + Equity (Accounting Equation)',
    'Revenue - Expenses = Net Income',
    'Debit = Credit (Double Entry Bookkeeping)',
    'Cash Flow = Operating + Investing + Financing',
    'ROI = (Gain - Cost) / Cost × 100',
    'Break-even Point = Fixed Costs / (Price - Variable Cost)',
    'Current Ratio = Current Assets / Current Liabilities',
    'Debt-to-Equity = Total Debt / Total Equity'
  ];

  const shortForms = [
    { short: 'P&L', full: 'Profit & Loss Statement' },
    { short: 'ROI', full: 'Return on Investment' },
    { short: 'EBITDA', full: 'Earnings Before Interest, Taxes, Depreciation, Amortization' },
    { short: 'NPV', full: 'Net Present Value' },
    { short: 'IRR', full: 'Internal Rate of Return' },
    { short: 'COGS', full: 'Cost of Goods Sold' },
    { short: 'GAAP', full: 'Generally Accepted Accounting Principles' },
    { short: 'IFRS', full: 'International Financial Reporting Standards' },
    { short: 'SEC', full: 'Securities and Exchange Commission' },
    { short: 'IPO', full: 'Initial Public Offering' },
    { short: 'M&A', full: 'Mergers and Acquisitions' },
    { short: 'B2B', full: 'Business to Business' },
    { short: 'B2C', full: 'Business to Consumer' },
    { short: 'CRM', full: 'Customer Relationship Management' },
    { short: 'ERP', full: 'Enterprise Resource Planning' },
    { short: 'KPI', full: 'Key Performance Indicator' },
    { short: 'SLA', full: 'Service Level Agreement' },
    { short: 'GDP', full: 'Gross Domestic Product' },
    { short: 'CPI', full: 'Consumer Price Index' },
    { short: 'FDI', full: 'Foreign Direct Investment' }
  ];

  const channels = [
    { name: 'Khan Academy Finance', url: 'https://www.youtube.com/@khanacademy', subscribers: '7.8M', description: 'Finance and economics basics' },
    { name: 'Accounting Stuff', url: 'https://www.youtube.com/@AccountingStuff', subscribers: '400K', description: 'Accounting concepts simplified' },
    { name: 'Corporate Finance Institute', url: 'https://www.youtube.com/@CorporateFinanceInstitute', subscribers: '300K', description: 'Professional finance training' },
    { name: 'The Plain Bagel', url: 'https://www.youtube.com/@ThePlainBagel', subscribers: '800K', description: 'Personal finance and investing' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Calculator className="text-green-400 mr-3" size={24} />
            <h3 className="text-white font-semibold text-xl">Business Calculator</h3>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <div className="text-right text-white text-3xl font-mono">{display}</div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <button onClick={clear} className="col-span-2 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors">
              Clear
            </button>
            <button onClick={() => inputOperation('÷')} className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
              ÷
            </button>
            <button onClick={() => inputOperation('×')} className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
              ×
            </button>
            
            {[7, 8, 9].map(num => (
              <button key={num} onClick={() => inputNumber(String(num))} className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
                {num}
              </button>
            ))}
            <button onClick={() => inputOperation('-')} className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
              -
            </button>
            
            {[4, 5, 6].map(num => (
              <button key={num} onClick={() => inputNumber(String(num))} className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
                {num}
              </button>
            ))}
            <button onClick={() => inputOperation('+')} className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
              +
            </button>
            
            {[1, 2, 3].map(num => (
              <button key={num} onClick={() => inputNumber(String(num))} className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
                {num}
              </button>
            ))}
            <button onClick={performCalculation} className="row-span-2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors">
              =
            </button>
            
            <button onClick={() => inputNumber('0')} className="col-span-2 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
              0
            </button>
            <button onClick={() => inputNumber('.')} className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
              .
            </button>
          </div>
        </div>

        {/* Golden Rules */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="text-yellow-400 mr-3" size={24} />
            <h3 className="text-white font-semibold text-xl">Golden Rules</h3>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {goldenRules.map((rule, index) => (
              <div key={index} className="p-3 bg-white/10 rounded-lg">
                <span className="text-white/90 text-sm">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Abbreviations */}
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="text-blue-400 mr-3" size={24} />
          <h3 className="text-white font-semibold text-xl">Business Abbreviations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {shortForms.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
              <span className="text-white font-medium text-sm">{item.short}</span>
              <span className="text-white/70 text-xs flex-1 ml-2">{item.full}</span>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Channels */}
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Youtube className="text-red-400 mr-3" size={24} />
          <h3 className="text-white font-semibold text-xl">Recommended Channels</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel, index) => (
            <motion.a
              key={index}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-white font-semibold group-hover:text-green-200 transition-colors">
                    {channel.name}
                  </h4>
                  <p className="text-white/60 text-sm">{channel.subscribers} subscribers</p>
                </div>
                <ExternalLink size={16} className="text-white/60 group-hover:text-white transition-colors" />
              </div>
              <p className="text-white/80 text-sm">{channel.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}

// Science Content
function ScienceContent() {
  const [selectedCategory, setSelectedCategory] = useState('channels');

  const channels = [
    { name: 'Veritasium', url: 'https://www.youtube.com/@veritasium', subscribers: '14M', description: 'Science and engineering videos' },
    { name: 'SciShow', url: 'https://www.youtube.com/@SciShow', subscribers: '7.2M', description: 'Quick science explanations' },
    { name: 'MinutePhysics', url: 'https://www.youtube.com/@minutephysics', subscribers: '5.8M', description: 'Physics concepts in minutes' },
    { name: 'Crash Course', url: 'https://www.youtube.com/@crashcourse', subscribers: '14.8M', description: 'Educational crash courses' },
    { name: 'Kurzgesagt', url: 'https://www.youtube.com/@kurzgesagt', subscribers: '20M', description: 'Animated science explanations' },
    { name: 'TED-Ed', url: 'https://www.youtube.com/@TEDEd', subscribers: '18M', description: 'Educational animations' }
  ];

  const diagrams = [
    {
      title: 'Periodic Table',
      description: 'Complete periodic table of elements with properties',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop'
    },
    {
      title: 'DNA Structure',
      description: 'Double helix structure and molecular composition',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
    },
    {
      title: 'Solar System',
      description: 'Planets, orbits, and celestial mechanics',
      imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop'
    },
    {
      title: 'Atomic Structure',
      description: 'Electron shells, nucleus, and subatomic particles',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop'
    }
  ];

  const abbreviations = [
    // Physics
    { short: 'SI', full: 'International System of Units' },
    { short: 'EMF', full: 'Electromotive Force' },
    { short: 'AC', full: 'Alternating Current' },
    { short: 'DC', full: 'Direct Current' },
    { short: 'LED', full: 'Light Emitting Diode' },
    { short: 'LCD', full: 'Liquid Crystal Display' },
    { short: 'GPS', full: 'Global Positioning System' },
    { short: 'MRI', full: 'Magnetic Resonance Imaging' },
    { short: 'UV', full: 'Ultraviolet' },
    { short: 'IR', full: 'Infrared' },
    
    // Chemistry
    { short: 'pH', full: 'Potential of Hydrogen' },
    { short: 'ATP', full: 'Adenosine Triphosphate' },
    { short: 'DNA', full: 'Deoxyribonucleic Acid' },
    { short: 'RNA', full: 'Ribonucleic Acid' },
    { short: 'PCR', full: 'Polymerase Chain Reaction' },
    { short: 'NMR', full: 'Nuclear Magnetic Resonance' },
    { short: 'HPLC', full: 'High Performance Liquid Chromatography' },
    { short: 'GC', full: 'Gas Chromatography' },
    { short: 'MS', full: 'Mass Spectrometry' },
    { short: 'FTIR', full: 'Fourier Transform Infrared Spectroscopy' },
    
    // Biology
    { short: 'GMO', full: 'Genetically Modified Organism' },
    { short: 'PCR', full: 'Polymerase Chain Reaction' },
    { short: 'ELISA', full: 'Enzyme-Linked Immunosorbent Assay' },
    { short: 'SEM', full: 'Scanning Electron Microscope' },
    { short: 'TEM', full: 'Transmission Electron Microscope' },
    { short: 'CRISPR', full: 'Clustered Regularly Interspaced Short Palindromic Repeats' },
    { short: 'mRNA', full: 'Messenger Ribonucleic Acid' },
    { short: 'tRNA', full: 'Transfer Ribonucleic Acid' },
    { short: 'rRNA', full: 'Ribosomal Ribonucleic Acid' },
    { short: 'HIV', full: 'Human Immunodeficiency Virus' }
  ];

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { id: 'channels', name: 'YouTube Channels', icon: Youtube },
            { id: 'abbreviations', name: 'Abbreviations', icon: Atom },
            { id: 'diagrams', name: 'Science Diagrams', icon: Microscope }
          ].map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-white/30 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <IconComponent size={18} className="mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {selectedCategory === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel, index) => (
            <motion.a
              key={index}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 hover:bg-white/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg group-hover:text-orange-200 transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-white/60 text-sm">{channel.subscribers} subscribers</p>
                </div>
                <ExternalLink size={20} className="text-white/60 group-hover:text-white transition-colors" />
              </div>
              <p className="text-white/80 text-sm">{channel.description}</p>
            </motion.a>
          ))}
        </div>
      )}

      {selectedCategory === 'abbreviations' && (
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-white font-semibold text-xl mb-4">Science Abbreviations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {abbreviations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex justify-between items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
              >
                <span className="text-white font-medium text-sm">{item.short}</span>
                <span className="text-white/70 text-xs flex-1 ml-3">{item.full}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {selectedCategory === 'diagrams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diagrams.map((diagram, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/30 transition-all"
            >
              <img
                src={diagram.imageUrl}
                alt={diagram.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-2">{diagram.title}</h3>
                <p className="text-white/80 text-sm">{diagram.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// General Content
function GeneralContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 text-center">
        <GraduationCap className="text-gray-400 mx-auto mb-4" size={64} />
        <h3 className="text-white font-semibold text-2xl mb-4">General Study Tools</h3>
        <p className="text-white/80 text-lg mb-6">Select a specific field above to access specialized tools and resources tailored to your area of study.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {[
            { name: 'Engineering', icon: Code },
            { name: 'Medical', icon: Stethoscope },
            { name: 'Arts', icon: Palette },
            { name: 'Commerce', icon: Calculator },
            { name: 'Science', icon: BookOpen }
          ].map((field, index) => {
            const IconComponent = field.icon;
            return (
              <div key={index} className="bg-white/10 rounded-xl p-4 text-center">
                <IconComponent size={32} className="mx-auto mb-2 text-white/60" />
                <span className="text-white/80 text-sm">{field.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}