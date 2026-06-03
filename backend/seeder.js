const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Complaint = require('./models/Complaint');

// ─── Sample Users ──────────────────────────────────────────────────────────
const sampleUsers = [
  {
    name: 'Admin Officer',
    email: 'admin@grievance.gov',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Citizen',
    email: 'john@example.com',
    password: 'user123',
    role: 'citizen',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'user123',
    role: 'citizen',
  },
];

// ─── Import Data ───────────────────────────────────────────────────────────
const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Complaint.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create users (passwords will be hashed by model pre-save hook)
    const createdUsers = await User.create(sampleUsers);
    console.log(`👥 Created ${createdUsers.length} users`);

    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const citizenUser1 = createdUsers.find((u) => u.email === 'john@example.com');
    const citizenUser2 = createdUsers.find((u) => u.email === 'priya@example.com');

    // ─── Sample Complaints ───────────────────────────────────────────────────
    const sampleComplaints = [
      {
        title: 'Broken water pipe flooding the street',
        description:
          'There is a broken water pipe on MG Road near the main market causing severe waterlogging and making the road impassable for pedestrians and vehicles. The pipe has been leaking for 3 days now.',
        department: 'Water Supply',
        priority: 'Urgent',
        status: 'In Progress',
        location: 'MG Road, Near Main Market, Sector 5',
        createdBy: citizenUser1._id,
        remarks: 'Repair team dispatched. Work in progress.',
        activityLog: [
          {
            action: 'Complaint Submitted',
            performedBy: citizenUser1._id,
            performedByName: citizenUser1.name,
            performedByRole: 'citizen',
            note: 'Complaint has been successfully submitted.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Status changed from "Pending" to "Under Review"',
            performedBy: adminUser._id,
            performedByName: adminUser.name,
            performedByRole: 'admin',
            note: 'Complaint received and under review.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Status changed from "Under Review" to "In Progress"',
            performedBy: adminUser._id,
            performedByName: adminUser.name,
            performedByRole: 'admin',
            note: 'Repair team dispatched to site.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        title: 'Street lights not working for 2 weeks',
        description:
          'The street lights on Gandhi Nagar Lane 3 have not been working for the past two weeks. This creates a very unsafe environment especially for women and children walking at night.',
        department: 'Electricity',
        priority: 'High',
        status: 'Under Review',
        location: 'Gandhi Nagar, Lane 3, Block B',
        createdBy: citizenUser2._id,
        activityLog: [
          {
            action: 'Complaint Submitted',
            performedBy: citizenUser2._id,
            performedByName: citizenUser2.name,
            performedByRole: 'citizen',
            note: 'Complaint submitted successfully.',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Status changed from "Pending" to "Under Review"',
            performedBy: adminUser._id,
            performedByName: adminUser.name,
            performedByRole: 'admin',
            note: 'Electricity department notified.',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        title: 'Potholes on main road causing accidents',
        description:
          'The main road connecting Sector 12 to the hospital is filled with large potholes that have caused multiple accidents in the past month. The road is extremely dangerous especially during rainy season.',
        department: 'Roads',
        priority: 'High',
        status: 'Pending',
        location: 'Sector 12 to City Hospital Road',
        createdBy: citizenUser1._id,
        activityLog: [
          {
            action: 'Complaint Submitted',
            performedBy: citizenUser1._id,
            performedByName: citizenUser1.name,
            performedByRole: 'citizen',
            note: 'Complaint submitted successfully.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        title: 'Garbage not collected for 10 days',
        description:
          'The garbage collection team has not visited our area for the past 10 days. The garbage is piling up on the streets causing severe hygiene and health issues for residents, especially elderly people.',
        department: 'Sanitation',
        priority: 'Urgent',
        status: 'Resolved',
        location: 'Rajiv Colony, Block C, Ward 7',
        createdBy: citizenUser2._id,
        remarks: 'Garbage collection team visited and cleared all garbage. Regular schedule resumed.',
        activityLog: [
          {
            action: 'Complaint Submitted',
            performedBy: citizenUser2._id,
            performedByName: citizenUser2.name,
            performedByRole: 'citizen',
            note: 'Complaint submitted successfully.',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Status changed from "Pending" to "In Progress"',
            performedBy: adminUser._id,
            performedByName: adminUser.name,
            performedByRole: 'admin',
            note: 'Sanitation team alerted.',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Status changed from "In Progress" to "Resolved"',
            performedBy: adminUser._id,
            performedByName: adminUser.name,
            performedByRole: 'admin',
            note: 'Garbage collected and schedule normalized.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        title: 'Hospital medicine shortage',
        description:
          'The government hospital in Sector 8 has been facing an acute shortage of basic medicines like antibiotics and blood pressure medications for the past 2 weeks. Many patients are suffering due to this shortage.',
        department: 'Healthcare',
        priority: 'Urgent',
        status: 'In Progress',
        location: 'Government Hospital, Sector 8',
        createdBy: citizenUser1._id,
        activityLog: [
          {
            action: 'Complaint Submitted',
            performedBy: citizenUser1._id,
            performedByName: citizenUser1.name,
            performedByRole: 'citizen',
            note: 'Complaint submitted successfully.',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Status changed from "Pending" to "In Progress"',
            performedBy: adminUser._id,
            performedByName: adminUser.name,
            performedByRole: 'admin',
            note: 'Health department contacted for emergency procurement.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        title: 'School building in dangerous condition',
        description:
          'The primary school building in Ward 12 has major structural cracks and the roof is leaking heavily during rains. Several classrooms are unusable. The safety of around 300 students is at serious risk.',
        department: 'Education',
        priority: 'High',
        status: 'Under Review',
        location: 'Government Primary School, Ward 12, Block A',
        createdBy: citizenUser2._id,
        activityLog: [
          {
            action: 'Complaint Submitted',
            performedBy: citizenUser2._id,
            performedByName: citizenUser2.name,
            performedByRole: 'citizen',
            note: 'Complaint submitted.',
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Status changed from "Pending" to "Under Review"',
            performedBy: adminUser._id,
            performedByName: adminUser.name,
            performedByRole: 'admin',
            note: 'Engineering team inspection scheduled.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        title: 'Illegal construction blocking public road',
        description:
          'An unauthorized construction is taking place on the public road near the bus stand blocking more than 60% of the road. This is causing major traffic congestion and accidents.',
        department: 'Public Safety',
        priority: 'Medium',
        status: 'Rejected',
        location: 'Near Bus Stand, Main Market Road',
        createdBy: citizenUser1._id,
        remarks: 'After inspection, the construction was found to be authorized with valid permits. Complaint rejected.',
        activityLog: [
          {
            action: 'Complaint Submitted',
            performedBy: citizenUser1._id,
            performedByName: citizenUser1.name,
            performedByRole: 'citizen',
            note: 'Complaint submitted.',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Status changed from "Pending" to "Rejected"',
            performedBy: adminUser._id,
            performedByName: adminUser.name,
            performedByRole: 'admin',
            note: 'Construction found to be authorized. Complaint rejected.',
            timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        title: 'Water supply disrupted for 5 days',
        description:
          'Our entire neighborhood has not received any water supply for the past 5 days. We are forced to buy expensive bottled water which is unaffordable for many families in our area.',
        department: 'Water Supply',
        priority: 'High',
        status: 'Resolved',
        location: 'Nehru Nagar, Blocks D, E and F',
        remarks: 'Pipeline repaired. Normal water supply restored to all blocks.',
        activityLog: [
          {
            action: 'Complaint Submitted',
            performedBy: citizenUser2._id,
            performedByName: citizenUser2.name,
            performedByRole: 'citizen',
            note: 'Complaint submitted.',
            timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Status changed from "Pending" to "Resolved"',
            performedBy: adminUser._id,
            performedByName: adminUser.name,
            performedByRole: 'admin',
            note: 'Pipeline repaired successfully.',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        ],
        createdBy: citizenUser2._id,
      },
      {
        title: 'Sewage overflow near residential area',
        description:
          'Sewage has been overflowing near the residential area in Shanti Nagar. The smell is unbearable and is causing health issues. Children are falling sick due to the unhygienic conditions.',
        department: 'Sanitation',
        priority: 'Urgent',
        status: 'Pending',
        location: 'Shanti Nagar, Near Park, Plot 45',
        createdBy: citizenUser1._id,
        activityLog: [
          {
            action: 'Complaint Submitted',
            performedBy: citizenUser1._id,
            performedByName: citizenUser1.name,
            performedByRole: 'citizen',
            note: 'Complaint submitted.',
            timestamp: new Date(),
          },
        ],
      },
      {
        title: 'Power cuts lasting 8+ hours daily',
        description:
          'Our area faces power cuts of 8 to 10 hours every day for the past month. This is severely affecting students preparing for exams, small businesses, and patients who need medical equipment.',
        department: 'Electricity',
        priority: 'High',
        status: 'Pending',
        location: 'Industrial Colony, Sector 15, All Blocks',
        createdBy: citizenUser2._id,
        activityLog: [
          {
            action: 'Complaint Submitted',
            performedBy: citizenUser2._id,
            performedByName: citizenUser2.name,
            performedByRole: 'citizen',
            note: 'Complaint submitted.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    ];

    // Generate tracking IDs for sample complaints based on their submission/log date to be realistic
    const countByDate = {};
    for (const c of sampleComplaints) {
      // Ensure category is set (required by model)
      if (!c.category && c.department) {
        c.category = c.department;
      }

      // Map legacy "Pending" status to valid "Submitted" status
      if (c.status === 'Pending') {
        c.status = 'Submitted';
      }

      const date = c.activityLog && c.activityLog[0] && c.activityLog[0].timestamp
        ? new Date(c.activityLog[0].timestamp)
        : new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}${month}${day}`;

      if (!countByDate[dateStr]) {
        countByDate[dateStr] = 0;
      }
      countByDate[dateStr]++;
      const sequence = String(countByDate[dateStr]).padStart(4, '0');
      c.trackingId = `GRV-${dateStr}-${sequence}`;
      
      // Update activityLog note to contain the correct tracking ID
      if (c.activityLog && c.activityLog[0]) {
        c.activityLog[0].note = `Complaint has been successfully submitted and assigned tracking ID: ${c.trackingId}`;
      }
    }

    await Complaint.create(sampleComplaints);
    console.log(`📋 Created ${sampleComplaints.length} sample complaints with unique Tracking IDs`);

    console.log('');
    console.log('✅ ================================');
    console.log('   Database seeded successfully!');
    console.log('   ================================');
    console.log('');
    console.log('📧 Login Credentials:');
    console.log('   Admin  → admin@grievance.gov / admin123');
    console.log('   Citizen → john@example.com / user123');
    console.log('   Citizen → priya@example.com / user123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// ─── Destroy Data ──────────────────────────────────────────────────────────
const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await Complaint.deleteMany();
    console.log('🗑️  All data destroyed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

// Run based on CLI argument
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  console.log('Usage: node seeder.js --import | --destroy');
  process.exit(1);
}
