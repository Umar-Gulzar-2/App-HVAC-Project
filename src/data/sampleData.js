/**
 * TEMPORARY SAMPLE DATA — Chunk 1 only.
 *
 * Used purely to demonstrate screen layouts. None of this is real
 * authentication or real company data. From Chunk 2 onward, screens read
 * from Cloud Firestore instead, and this file is no longer imported by
 * production screens.
 */

export const demoCompany = {
  id: 'demo-company-001',
  name: 'Premier Commercial HVAC',
  plan: 'Spark (free tier)',
};

export const technicians = [
  { id: 'tech-01', name: 'Alex Rivera', email: 'alex.rivera@example.com', role: 'technician', status: 'active' },
  { id: 'tech-02', name: 'Jordan Lee', email: 'jordan.lee@example.com', role: 'technician', status: 'active' },
  { id: 'tech-03', name: 'Sam Patel', email: 'sam.patel@example.com', role: 'technician', status: 'inactive' },
  { id: 'admin-01', name: 'Umar Gulzar', email: 'owner@example.com', role: 'admin', status: 'active' },
];

export const projects = [
  {
    id: 'prj-01',
    name: 'Lahore Business Park — Block C',
    client: 'Lahore Business Park',
    siteAddress: 'Block C, Johar Town, Lahore',
    status: 'active',
  },
  {
    id: 'prj-02',
    name: 'Metro Cash & Carry — Gulberg',
    client: 'Metro Cash & Carry',
    siteAddress: 'Main Boulevard, Gulberg III, Lahore',
    status: 'active',
  },
  {
    id: 'prj-03',
    name: 'Allama Iqbal Medical Center',
    client: 'AIMC Facilities',
    siteAddress: 'Jail Road, Lahore',
    status: 'active',
  },
  {
    id: 'prj-04',
    name: 'Defence Shopping Mall — Rooftop Plant',
    client: 'DSM Management',
    siteAddress: 'Defence Road, Lahore',
    status: 'inactive',
  },
];

export const acModels = [
  { id: 'mdl-01', manufacturer: 'Carrier', modelNumber: '30XA-1202', equipmentType: 'Air-Cooled Chiller', status: 'active' },
  { id: 'mdl-02', manufacturer: 'Trane', modelNumber: 'RTAC-140', equipmentType: 'Rooftop Package Unit', status: 'active' },
  { id: 'mdl-03', manufacturer: 'Daikin', modelNumber: 'RZQ100TAV1', equipmentType: 'Split System Condensing Unit', status: 'active' },
  { id: 'mdl-04', manufacturer: 'Carrier', modelNumber: '48TC-D12', equipmentType: 'Rooftop Package Unit', status: 'inactive' },
];

export const units = [
  {
    id: 'ACU-2025-0001',
    projectId: 'prj-01',
    modelId: 'mdl-01',
    serialNumber: 'CAR-30XA-77120',
    installationDate: '2025-03-14',
    refrigerantType: 'R-410A',
    fullChargeLbs: 240,
    status: 'active',
  },
  {
    id: 'ACU-2025-0002',
    projectId: 'prj-01',
    modelId: 'mdl-03',
    serialNumber: 'DKK-RZQ-55831',
    installationDate: '2025-04-02',
    refrigerantType: 'R-410A',
    fullChargeLbs: 12,
    status: 'active',
  },
  {
    id: 'ACU-2025-0003',
    projectId: 'prj-02',
    modelId: 'mdl-02',
    serialNumber: 'TRN-RTAC-31907',
    installationDate: '2025-06-21',
    refrigerantType: 'R-454B',
    fullChargeLbs: 88,
    status: 'active',
  },
  {
    id: 'ACU-2026-0004',
    projectId: 'prj-03',
    modelId: 'mdl-03',
    serialNumber: 'DKK-RZQ-61142',
    installationDate: '2026-01-19',
    refrigerantType: 'R-32',
    fullChargeLbs: 11.5,
    status: 'active',
  },
  {
    id: 'ACU-2026-0005',
    projectId: 'prj-02',
    modelId: 'mdl-04',
    serialNumber: 'CAR-48TC-90066',
    installationDate: '2026-02-08',
    refrigerantType: 'R-410A',
    fullChargeLbs: 64,
    status: 'active',
  },
];

export const serviceRecords = [
  {
    id: 'svc-001',
    date: '2026-03-04',
    serviceType: 'Maintenance',
    projectId: 'prj-01',
    unitId: 'ACU-2025-0001',
    technicianId: 'tech-01',
    workPerformed: 'Quarterly preventive maintenance: coil cleaning, filter replacement, electrical connections checked.',
    refrigerantQuantity: null,
    leakRepairInfo: null,
    testNotes: 'Supply and return temperatures within spec. No leaks found.',
  },
  {
    id: 'svc-002',
    date: '2026-04-17',
    serviceType: 'Refrigerant Service',
    projectId: 'prj-02',
    unitId: 'ACU-2025-0003',
    technicianId: 'tech-02',
    workPerformed: 'Added refrigerant after locating low charge at service valve.',
    refrigerantQuantity: 9.5,
    leakRepairInfo: 'Evaporator service valve packing replaced, joint re-tightened.',
    testNotes: 'Leak test with electronic detector: pass. Pressures stable after 30 minutes.',
  },
  {
    id: 'svc-003',
    date: '2026-05-02',
    serviceType: 'Repair',
    projectId: 'prj-01',
    unitId: 'ACU-2025-0002',
    technicianId: 'tech-01',
    workPerformed: 'Replaced failed capacitor and defective contactor on condensing unit.',
    refrigerantQuantity: null,
    leakRepairInfo: 'No refrigerant leak involved; electrical repair only.',
    testNotes: 'Unit starts and runs normally. Amp draw within nameplate range.',
  },
  {
    id: 'svc-004',
    date: '2026-06-11',
    serviceType: 'Installation',
    projectId: 'prj-03',
    unitId: 'ACU-2026-0004',
    technicianId: 'tech-02',
    workPerformed: 'Commissioned newly installed split system: vacuum, charge verification, controls setup.',
    refrigerantQuantity: null,
    leakRepairInfo: null,
    testNotes: 'Factory charge verified against nameplate. System operational.',
  },
  {
    id: 'svc-005',
    date: '2026-07-25',
    serviceType: 'Refrigerant Service',
    projectId: 'prj-01',
    unitId: 'ACU-2025-0001',
    technicianId: 'tech-01',
    workPerformed: 'Recovered refrigerant for compressor replacement, recharged after repair.',
    refrigerantQuantity: 24,
    leakRepairInfo: 'Compressor replaced; system pressure-tested to 450 psi with nitrogen.',
    testNotes: 'Pressure test pass, vacuum pulled to 500 microns, no decay observed.',
  },
  {
    id: 'svc-006',
    date: '2026-08-14',
    serviceType: 'Maintenance',
    projectId: 'prj-02',
    unitId: 'ACU-2025-0003',
    technicianId: 'tech-02',
    workPerformed: 'Rooftop unit seasonal maintenance: belts, bearings, condensate drain flush.',
    refrigerantQuantity: null,
    leakRepairInfo: null,
    testNotes: 'Differential pressure normal. Recommended belt replacement next visit.',
  },
  {
    id: 'svc-007',
    date: '2026-09-30',
    serviceType: 'Repair',
    projectId: 'prj-02',
    unitId: 'ACU-2026-0005',
    technicianId: 'tech-01',
    workPerformed: 'Replaced failed economizer actuator and recalibrated damper linkage.',
    refrigerantQuantity: null,
    leakRepairInfo: 'No refrigerant circuit involvement.',
    testNotes: 'Economizer modulation verified across full range.',
  },
  {
    id: 'svc-008',
    date: '2026-10-22',
    serviceType: 'Refrigerant Service',
    projectId: 'prj-03',
    unitId: 'ACU-2026-0004',
    technicianId: 'tech-02',
    workPerformed: 'Documented refrigerant addition during troubleshooting of cooling shortfall.',
    refrigerantQuantity: 1.2,
    leakRepairInfo: 'Suspected micro-leak at flare joint — follow-up inspection required.',
    testNotes: 'Leak detector indicated joint; needs confirmation with bubble test at next visit.',
  },
];

export const attentionCases = [
  {
    id: 'att-001',
    unitId: 'ACU-2026-0004',
    projectId: 'prj-03',
    title: 'Refrigerant addition without confirmed leak test',
    reason: 'Service record svc-008 documents a refrigerant addition with a suspected leak that has not been confirmed.',
    severity: 'warning',
    status: 'open',
    createdAt: '2026-10-22',
    assignedTechnicianIds: ['tech-02'],
  },
  {
    id: 'att-002',
    unitId: 'ACU-2025-0001',
    projectId: 'prj-01',
    title: 'Second refrigerant service on the same unit this year',
    reason: 'Two refrigerant-related records exist for this unit within the review period. Verify whether the supported leak-repair conditions apply.',
    severity: 'danger',
    status: 'open',
    createdAt: '2026-07-25',
    assignedTechnicianIds: ['tech-01'],
  },
  {
    id: 'att-003',
    unitId: 'ACU-2025-0003',
    projectId: 'prj-02',
    title: 'Charge verification after repair',
    reason: 'Refrigerant added after service valve repair — confirm final charge against nameplate.',
    severity: 'info',
    status: 'resolved',
    createdAt: '2026-04-17',
    resolvedAt: '2026-04-20',
    resolvedBy: 'Company Owner',
    resolutionReason: 'Final charge verified against nameplate; leak test passed. No further action required.',
    assignedTechnicianIds: ['tech-02'],
  },
];

/** Lookups used by screens to render readable labels. */
export const techniciansById = Object.fromEntries(technicians.map((t) => [t.id, t]));
export const projectsById = Object.fromEntries(projects.map((p) => [p.id, p]));
export const acModelsById = Object.fromEntries(acModels.map((m) => [m.id, m]));
export const unitsById = Object.fromEntries(units.map((u) => [u.id, u]));
