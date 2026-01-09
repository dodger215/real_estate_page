require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
const Blog = require('./models/Blog');
const Agent = require('./models/Agent');
const Service = require('./models/Service');
const PageContent = require('./models/PageContent');
const SiteSettings = require('./models/SiteSettings');
const bcrypt = require('bcryptjs');

console.log(process.env.MONGODB_URI)

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Property.deleteMany({});
        await Blog.deleteMany({});
        await Agent.deleteMany({});
        await Service.deleteMany({});
        await PageContent.deleteMany({});
        await SiteSettings.deleteMany({});

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('BenAlb2026!', salt);
        const editorPassword = await bcrypt.hash('Editor123!', salt);

        // 1. Seed Admin Users (Directors)
        const admin1 = new User({
            name: 'Dr. Ben Asante',
            email: 'ben.asante@bentalb.com',
            password: adminPassword,
            role: 'admin',
            position: 'Director - Engineer',
            phone: '0244741919',
            permissions: {
                content: true,
                media: true,
                leads: true,
                users: true,
                properties: true,
                agents: true
            },
            isActive: true
        });
        await admin1.save();

        const admin2 = new User({
            name: 'Mr. Albert Kofi Krakue',
            email: 'albert.krakue@bentalb.com',
            password: adminPassword,
            role: 'admin',
            position: 'Director - Chartered Accountant',
            phone: '0277383722',
            permissions: {
                content: true,
                media: true,
                leads: true,
                users: true,
                properties: true,
                agents: true
            },
            isActive: true
        });
        await admin2.save();

        // Seed Editor
        const editor = new User({
            name: 'Sarah Jenkins',
            email: 'sarah.jenkins@bentalb.com',
            password: editorPassword,
            role: 'editor',
            position: 'Senior Luxury Consultant',
            phone: '0200773728',
            permissions: {
                content: true,
                media: true,
                leads: true,
                users: false,
                properties: true,
                agents: true
            },
            isActive: true
        });
        await editor.save();
        console.log('Users created');

        // 2. Seed Site Settings
        const settings = new SiteSettings({
            siteName: 'BenAlb Real Estates',
            tagline: 'Elegant and Affordable',
            siteDescription: 'Premier real estate company specializing in buying and selling of lands, houses, and contract construction. Your trusted partner in elegant and affordable property solutions.',
            contactEmails: ['info@bentalb.com', 'sales@bentalb.com', 'contact@bentalb.com'],
            contactPhones: ['0277383722', '0244741919', '0200773728'],
            whatsappNumbers: ['0244741919', '0277383722'],
            address: 'GPS Address: GS-02529847, Bort 75 St., West Hills Residential Area, Dunkonah, Accra. Behind West Hills Mall',
            officeHours: 'Monday - Friday: 8:00 AM - 6:00 PM | Saturday: 9:00 AM - 2:00 PM',
            socialLinks: {
                facebook: 'https://facebook.com/BenAlbRealEstates',
                instagram: 'https://instagram.com/BenAlbRealEstates',
                linkedin: 'https://linkedin.com/company/BenAlbRealEstates',
                twitter: 'https://twitter.com/BenAlbEstates',
                whatsapp: 'https://wa.me/233244741919'
            },
            services: [
                'Buying and Selling of Lands',
                'Buying and Selling of Houses',
                'Contract Construction of Houses',
                'Property Management',
                'Real Estate Investment Advisory'
            ],
            businessLocations: [
                'East Legon',
                'Cantoments', 
                'West Legon',
                'West Hills Residential Area',
                'Dansoman',
                'Kumasi',
                'Takoradi',
                'Airport Residential Area'
            ],
            logoUrl: 'https://images.unsplash.com/photo-1623298317882-8e6a7d21e8e8?auto=format&fit=crop&w=400&q=80',
            faviconUrl: 'https://images.unsplash.com/photo-1623298317882-8e6a7d21e8e8?auto=format&fit=crop&w=64&q=80',
            themeColor: '#1e40af',
            footerText: '© 2026 BenAlb Real Estates. All rights reserved. Elegant and Affordable.',
            seoKeywords: ['real estate Ghana', 'land for sale', 'houses for sale Accra', 'property construction', 'BenAlb Properties', 'affordable housing Ghana']
        });
        await settings.save();
        console.log('Site settings created');

        // 3. Seed Agents
        const agent1 = await new Agent({
            name: 'Sarah Jenkins',
            role: 'Senior Luxury Consultant',
            position: 'Head of Sales',
            bio: 'With over 15 years of experience in the luxury market, Sarah specializes in premium properties across Ghana. Her expertise in both residential and commercial real estate has helped hundreds of clients find their perfect property.',
            email: 'sarah.jenkins@bentalb.com',
            phone: '0200773728',
            whatsapp: '0200773728',
            specialization: ['Luxury Homes', 'Commercial Properties', 'Investment Properties'],
            experience: '15+ years',
            languages: ['English', 'Twi', 'French'],
            photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
            isFeatured: true,
            isActive: true
        }).save();

        const agent2 = await new Agent({
            name: 'Michael Chen',
            role: 'Investment Specialist',
            position: 'Investment Director',
            bio: 'Expert in high-yield real estate investments across Ghana. Michael has a proven track record of identifying lucrative investment opportunities in emerging Ghanaian property markets.',
            email: 'michael.chen@bentalb.com',
            phone: '0277383722',
            whatsapp: '0277383722',
            specialization: ['Property Investment', 'Market Analysis', 'Portfolio Management'],
            experience: '12+ years',
            languages: ['English', 'Mandarin'],
            photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80',
            isFeatured: true,
            isActive: true
        }).save();

        const agent3 = await new Agent({
            name: 'Ama Serwaa',
            role: 'Construction Manager',
            position: 'Head of Construction',
            bio: 'With a background in civil engineering, Ama oversees all construction projects from planning to completion. She ensures every BenAlb property meets the highest standards of quality and design.',
            email: 'ama.serwaa@bentalb.com',
            phone: '0244741919',
            whatsapp: '0244741919',
            specialization: ['Project Management', 'Construction Planning', 'Quality Control'],
            experience: '10+ years',
            languages: ['English', 'Twi', 'Ga'],
            photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80',
            isFeatured: true,
            isActive: true
        }).save();
        console.log('Agents created');

        // 4. Seed Properties (Sample properties in different locations)
        const properties = [
            {
                title: 'Warehouse for Rent',
                slug: 'modern-luxury-villa-east-legon',
                type: 'Villa',
                status: 'Ready',
                price: 850000,
                location: 'East Legon, Accra',
                description: 'A stunning modern villa featuring contemporary architecture with premium finishes. This 5-bedroom masterpiece offers spacious living areas, a private garden, and premium amenities.',
                size: '850 sqm',
                plotSize: '0.25 acres',
                bedrooms: 5,
                bathrooms: 6,
                parking: 4,
                amenities: ['Backup Generator', '24/7 Security'],
                features: ['Waterfront View', 'Gated Community', 'Central AC', 'Solar Panels'],
                featuredImage: 'https://files.imagetourl.net/uploads/1767910159315-a43b8c89-c8e9-48f5-bdee-9c5d899c039b.jpeg',
                images: [
                    'https://ibb.co/Kc4qcY8Q',
                    'https://ibb.co/Kc4qcY8Q',
                    'https://ibb.co/Kc4qcY8Q'
                ],
                agent: agent1._id,
                locationFeatures: ['Near Airport', 'Shopping Mall Access', 'International Schools Nearby'],
                isFeatured: true,
                isPublished: true,
                yearBuilt: 2023
            },
            {
                title: 'Executive Apartment',
                slug: 'executive-apartment-cantoments',
                type: 'Apartment',
                status: 'Ready',
                price: 450000,
                location: 'Cantoments, Accra',
                description: 'Beautifully designed executive apartment with premium finishes. Perfect for professionals seeking luxury living in the heart of Cantoments.',
                size: '280 sqm',
                plotSize: 'N/A',
                bedrooms: 3,
                bathrooms: 3,
                parking: 2,
                amenities: ['Concierge Service', 'Swimming Pool', 'Gym', 'Security', 'Elevator', 'Balcony'],
                features: ['City View', 'Fully Furnished', 'Modern Kitchen', 'Walk-in Closets'],
                featuredImage: 'https://ibb.co/fYRcpPPh',
                images: [
                    'https://ibb.co/fYRcpPPh',
                    'https://ibb.co/fYRcpPPh'
                ],
                agent: agent2._id,
                isFeatured: true,
                isPublished: true,
                yearBuilt: 2022
            },
            // {
            //     title: 'Vacant Land for Development',
            //     slug: 'vacant-land-west-hills',
            //     type: 'Land',
            //     status: 'Available',
            //     price: 350000,
            //     location: 'West Hills Residential Area, Accra',
            //     description: 'Prime land parcel in the fast-growing West Hills area. Perfect for residential development with all necessary utilities available.',
            //     size: '0.5 acres',
            //     plotSize: '0.5 acres',
            //     bedrooms: 0,
            //     bathrooms: 0,
            //     parking: 0,
            //     amenities: ['Utility Connections', 'Road Access', 'Security', 'Drainage System'],
            //     features: ['Flat Terrain', 'Good Drainage', 'Fenced', 'Surveyed'],
            //     featuredImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
            //     images: [
            //         'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
            //         'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
            //     ],
            //     agent: agent3._id,
            //     locationFeatures: ['Near West Hills Mall', 'Good Road Network', 'Residential Area'],
            //     isFeatured: true,
            //     isPublished: true
            // },
            // {
            //     title: 'Luxury Townhouse',
            //     slug: 'luxury-townhouse-airport-residential',
            //     type: 'Townhouse',
            //     status: 'Under Construction',
            //     price: 650000,
            //     location: 'Airport Residential Area, Accra',
            //     description: 'Modern townhouse development in the prestigious Airport Residential Area. Completion expected in 9 months.',
            //     size: '450 sqm',
            //     plotSize: '0.15 acres',
            //     bedrooms: 4,
            //     bathrooms: 4,
            //     parking: 3,
            //     amenities: ['Shared Pool', 'Clubhouse', 'Children\'s Play Area', '24/7 Security', 'Backup Power'],
            //     features: ['Modern Design', 'Energy Efficient', 'Smart Home Ready', 'Private Garden'],
            //     featuredImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
            //     agent: agent1._id,
            //     isFeatured: false,
            //     isPublished: true,
            //     yearBuilt: 2026,
            //     estimatedCompletion: 'December 2026'
            // }
        ];

        for (const prop of properties) {
            await new Property(prop).save();
        }
        console.log('Properties created');

        // 5. Seed Blogs
        const blogs = [
            {
                title: 'Top 10 Real Estate Investment Opportunities in Ghana 2026',
                slug: 'real-estate-investment-opportunities-ghana-2026',
                content: `
                    <h2>Why Invest in Ghanaian Real Estate?</h2>
                    <p>The Ghanaian real estate market continues to show remarkable growth, driven by urbanization and economic development. Here are the top opportunities:</p>
                    
                    <h3>1. Residential Properties in Emerging Areas</h3>
                    <p>Areas like West Hills and East Legon are experiencing rapid development, offering excellent returns on investment.</p>
                    
                    <h3>2. Commercial Developments</h3>
                    <p>Office spaces and retail complexes in Accra's business districts are in high demand.</p>
                    
                    <h3>3. Affordable Housing Projects</h3>
                    <p>Government initiatives are creating opportunities in the affordable housing sector.</p>
                    
                    <p>At BenAlb Real Estates, we help investors identify and capitalize on these opportunities with our expert guidance.</p>
                `,
                excerpt: 'Discover the most promising real estate investment opportunities in Ghana for 2026 and beyond.',
                author: 'Michael Chen',
                category: 'Investment',
                tags: ['investment', 'market trends', 'Ghana real estate'],
                featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
                readTime: '5 min read',
                isPublished: true,
                isFeatured: true
            },
            {
                title: 'Guide to Buying Land in Ghana: Everything You Need to Know',
                slug: 'guide-buying-land-ghana',
                content: `
                    <h2>Essential Steps for Land Purchase in Ghana</h2>
                    <p>Buying land in Ghana requires careful consideration and due diligence. Follow our comprehensive guide:</p>
                    
                    <h3>1. Land Search and Verification</h3>
                    <p>Always verify land ownership through the Lands Commission and conduct proper searches.</p>
                    
                    <h3>2. Site Inspection</h3>
                    <p>Visit the site with a qualified surveyor to confirm boundaries and check for encumbrances.</p>
                    
                    <h3>3. Legal Documentation</h3>
                    <p>Ensure all necessary documents are in order, including site plans and title certificates.</p>
                    
                    <h3>4. Registration</h3>
                    <p>Complete registration with the relevant authorities to secure your ownership.</p>
                    
                    <p>BenAlb Real Estates provides complete assistance throughout this process, ensuring a smooth and secure transaction.</p>
                `,
                excerpt: 'A comprehensive guide to navigating the land purchase process in Ghana safely and successfully.',
                author: 'Sarah Jenkins',
                category: 'Buying Guide',
                tags: ['land purchase', 'legal guide', 'property ownership'],
                featuredImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
                readTime: '7 min read',
                isPublished: true
            },
            {
                title: 'Construction Cost Breakdown: Building Your Dream Home in Ghana',
                slug: 'construction-cost-breakdown-ghana',
                content: `
                    <h2>Understanding Construction Costs in Ghana</h2>
                    <p>Building a home in Ghana requires careful budgeting. Here's a detailed breakdown:</p>
                    
                    <h3>1. Land Acquisition (20-30%)</h3>
                    <p>Cost varies by location and size of plot.</p>
                    
                    <h3>2. Design and Planning (5-10%)</h3>
                    <p>Architectural designs, engineering plans, and permits.</p>
                    
                    <h3>3. Construction (50-60%)</h3>
                    <p>Materials, labor, and project management costs.</p>
                    
                    <h3>4. Finishing and Utilities (15-20%)</h3>
                    <p>Interior finishing, electrical, plumbing, and landscaping.</p>
                    
                    <p>BenAlb Real Estates offers transparent cost estimates and manages your construction project from start to finish, ensuring quality and staying within budget.</p>
                `,
                excerpt: 'Detailed analysis of construction costs for building a home in Ghana, including budget planning tips.',
                author: 'Ama Serwaa',
                category: 'Construction',
                tags: ['construction', 'cost analysis', 'home building'],
                featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
                readTime: '6 min read',
                isPublished: true
            }
        ];

        for (const blog of blogs) {
            await new Blog(blog).save();
        }
        console.log('Blogs created');

        // 6. Seed Services
        const services = [
            {
                title: 'Land Acquisition & Sales',
                description: 'Comprehensive services for buying and selling prime lands across Ghana. We handle everything from search to registration.',
                icon: 'MapPin',
                features: ['Land Search & Verification', 'Title Transfer Assistance', 'Site Inspection', 'Legal Documentation']
            },
            {
                title: 'Property Sales & Purchase',
                description: 'Expert assistance in buying and selling residential and commercial properties. Get the best deals with our market expertise.',
                icon: 'Home',
                features: ['Property Valuation', 'Market Analysis', 'Negotiation Support', 'Closing Assistance'],
                isFeatured: true
            },
            {
                title: 'Contract Construction',
                description: 'End-to-end construction services from design to completion. We build quality homes that combine elegance with affordability.',
                icon: 'Building',
                features: ['Architectural Design', 'Project Management', 'Quality Construction', 'Timely Delivery'],
                isFeatured: true
            },
            {
                title: 'Property Management',
                description: 'Professional management services for your real estate investments, ensuring optimal returns and maintenance.',
                icon: 'Settings',
                features: ['Tenant Management', 'Property Maintenance', 'Rent Collection', 'Regular Inspections']
            },
            {
                title: 'Investment Advisory',
                description: 'Strategic advice for real estate investors. Maximize your returns with our market insights and portfolio management.',
                icon: 'TrendingUp',
                features: ['Market Research', 'Investment Analysis', 'Portfolio Strategy', 'Risk Assessment'],
                isFeatured: true
            },
            {
                title: 'Legal & Documentation',
                description: 'Complete legal support for all real estate transactions. Ensure your investments are properly documented and protected.',
                icon: 'FileText',
                features: ['Legal Consultation', 'Document Preparation', 'Registration Assistance', 'Dispute Resolution']
            }
        ];

        for (const service of services) {
            await new Service(service).save();
        }
        console.log('Services created');

        // 7. Seed Page Content
        const content = new PageContent({
            hero: {
                headline: 'Discover Elegant & Affordable Properties',
                subheadline: 'Your trusted partner in real estate - From land acquisition to dream home construction.',
                backgroundImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
                ctaText: 'View Our Properties',
                ctaAction: '/properties',
                secondaryCtaText: 'Contact Us',
                secondaryCtaAction: '/contact',
                showBadge: true,
                badgeText: 'Premium Listings Available',
                stats: [
                    { label: 'Properties Sold', value: '250+' },
                    { label: 'Happy Clients', value: '500+' },
                    { label: 'Years Experience', value: '15+' },
                    { label: 'Locations', value: '8+' }
                ]
            },
            about: {
                title: 'About BenAlb Real Estates',
                subtitle: 'Elegant and Affordable - Our Promise to You',
                content: 'Founded by Dr. Ben Asante (Engineer) and Mr. Albert Kofi Krakue (Chartered Accountant), BenAlb Real Estates combines engineering excellence with financial expertise to deliver unparalleled real estate services. We specialize in buying and selling of lands, houses, and contract construction of houses.',
                mission: 'To provide elegant and affordable real estate solutions that transform lives and communities.',
                vision: 'To be Ghana\'s most trusted real estate partner, known for quality, integrity, and exceptional value.',
                values: ['Integrity', 'Excellence', 'Customer Focus', 'Innovation', 'Sustainability'],
                teamDescription: 'Our team of experienced professionals is dedicated to helping you navigate the real estate market with confidence and ease.',
                image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
            },
            contactPage: {
                title: 'Get In Touch With Us',
                description: 'Our team of experts is ready to assist you with all your real estate needs. Contact us today for personalized service.',
                officeLocation: 'GPS Address: GS-02529847, Bort 75 St., West Hills Residential Area, Dunkonah, Accra. Behind West Hills Mall',
                mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.7886381772767!2d-0.22860172404052952!3d5.603291933945598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9089b1f5b3ab%3A0x4e66b43dafc2d670!2sWest%20Hills%20Mall!5e0!3m2!1sen!2sgh!4v1644323456789!5m2!1sen!2sgh',
                contactMethods: [
                    {
                        type: 'phone',
                        title: 'Call Us',
                        details: ['0277383722', '0244741919', '0200773728'],
                        icon: 'Phone'
                    },
                    {
                        type: 'whatsapp',
                        title: 'WhatsApp',
                        details: ['0244741919', '0277383722'],
                        icon: 'MessageCircle'
                    },
                    {
                        type: 'email',
                        title: 'Email Us',
                        details: ['info@bentalb.com', 'sales@bentalb.com'],
                        icon: 'Mail'
                    },
                    {
                        type: 'hours',
                        title: 'Office Hours',
                        details: ['Mon-Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 2:00 PM'],
                        icon: 'Clock'
                    }
                ]
            },
            testimonials: [
                {
                    name: 'Dr. Kwame Osei',
                    role: 'Medical Director',
                    content: 'BenAlb helped me acquire a perfect plot in West Hills. Their professionalism and attention to detail were exceptional. Highly recommended!',
                    avatar: 'https://i.pravatar.cc/100?u=kwame',
                    property: 'Land Purchase - West Hills'
                },
                {
                    name: 'Mrs. Abena Mensah',
                    role: 'Business Owner',
                    content: 'From design to completion, BenAlb built my dream home. They delivered quality construction within budget and timeline. Truly elegant and affordable!',
                    avatar: 'https://i.pravatar.cc/100?u=abena',
                    property: 'Home Construction - East Legon'
                },
                {
                    name: 'Mr. David Johnson',
                    role: 'Investor',
                    content: 'Their investment advice helped me build a profitable property portfolio. The team at BenAlb understands the market like no one else.',
                    avatar: 'https://i.pravatar.cc/100?u=david',
                    property: 'Multiple Investments'
                }
            ],
            faq: [
                {
                    question: 'How do I verify the authenticity of a land title?',
                    answer: 'We conduct thorough due diligence including searches at the Lands Commission, verification of indenture, and site inspections with surveyors to ensure all documents are legitimate.'
                },
                {
                    question: 'What is the typical timeline for building a house?',
                    answer: 'Depending on the size and complexity, construction typically takes 6-12 months. We provide detailed project timelines during the planning phase.'
                },
                {
                    question: 'Do you offer financing options for property purchase?',
                    answer: 'Yes, we partner with several financial institutions to help our clients secure mortgages and construction loans at competitive rates.'
                },
                {
                    question: 'What areas do you operate in?',
                    answer: 'We operate in Accra (East Legon, Cantoments, West Legon, West Hills, Dansoman, Airport Residential Area), Kumasi, and Takoradi.'
                },
                {
                    question: 'How do I schedule a property viewing?',
                    answer: 'You can schedule a viewing by calling any of our contact numbers, sending a WhatsApp message, or filling out the contact form on our website.'
                }
            ],
            trustIndicators: [
                {
                    title: 'Verified Properties',
                    description: 'Every property undergoes thorough verification',
                    icon: 'Shield'
                },
                {
                    title: 'Legal Compliance',
                    description: 'Full compliance with Ghanaian real estate laws',
                    icon: 'Scale'
                },
                {
                    title: 'Expert Team',
                    description: '15+ years of combined experience',
                    icon: 'Users'
                },
                {
                    title: 'Transparent Pricing',
                    description: 'No hidden costs, clear breakdown',
                    icon: 'DollarSign'
                }
            ],
            layout: ['hero', 'trust', 'services', 'featuredProperties', 'about', 'testimonials', 'faq', 'contact']
        });
        await content.save();
        console.log('Page content created');

        console.log('✅ Seeding completed successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 SEED DATA SUMMARY:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👥 Users: 3 (2 Admins, 1 Editor)');
        console.log('🏢 Agents: 3');
        console.log('🏠 Properties: 4 (across different locations)');
        console.log('📝 Blogs: 3');
        console.log('⚙️ Services: 6');
        console.log('⚙️ Site Settings: 1');
        console.log('📄 Page Content: 1');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔑 Admin Login Credentials:');
        console.log('Email: ben.asante@bentalb.com');
        console.log('Password: BenAlb2026!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📞 Contact Information:');
        console.log('Phones: 0277383722, 0244741919, 0200773728');
        console.log('WhatsApp: 0244741919, 0277383722');
        console.log('📍 Office: West Hills Residential Area, Behind West Hills Mall');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedData();