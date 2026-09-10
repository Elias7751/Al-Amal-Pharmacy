const Prescription = require('../models/Prescription');
const User = require('../models/User');

class PrescriptionService {
  /**
   * User uploads a prescription
   */
  static async uploadPrescription(userId, imagePath, userNotes) {
    return await Prescription.create({
      userId,
      image: imagePath,
      userNotes
    });
  }

  /**
   * Get all prescriptions for a specific user
   */
  static async getUserPrescriptions(userId) {
    return await Prescription.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Get a specific prescription by ID for a user
   */
  static async getPrescriptionById(userId, prescriptionId) {
    const prescription = await Prescription.findOne({
      where: { id: prescriptionId, userId }
    });
    if (!prescription) throw new Error('Prescription not found');
    return prescription;
  }

  static async getAllPrescriptions() {
    return await Prescription.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Admin: Update status and add notes
   */
  static async updateStatus(prescriptionId, status, adminNotes) {
    const prescription = await Prescription.findByPk(prescriptionId);
    if (!prescription) throw new Error('Prescription not found');

    prescription.status = status || prescription.status;
    prescription.adminNotes = adminNotes || prescription.adminNotes;
    
    return await prescription.save();
  }
}

module.exports = PrescriptionService;
