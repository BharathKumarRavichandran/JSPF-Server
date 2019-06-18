const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String
	},
	instiEmail: {
		type: String,
		unique: true
	},
	verificationCode: {
		type: String
	},
	isVerified1: {
		type: Boolean,
		default: false
	},
	isVerified2: {
		type: Boolean,
		default: false
	},
	applicationNumber: {
		type: String,
		unique: true
	},
	personalInfo: {
		name: String,
		rollNumber: String,
		department: String,
		contactNumberCall: String,
		contactNumberWhatsapp: String,
		tshirtSize: {
			type: String,
			enum: ['XS','S','M','L','XL','XXL','XXXL']
		},
		introduction: String
	},
	certificates: {
		gradeSheetSem1: String,
		instiCertificate: String,
		nonInstiCertificate: String,
		gradeSheetMOOC: String
	},
	abstract: {
		docLink: String,
		projectAbstract: String,
		supportingFiles: {
			type: Array
		}
	},
	essays: {
		mentors: {
			sop: String,
			community: String,
			society: String
		},
		final: {
			sop: String,
			community: String,
			society: String
		}
	},
	signature: {
		type: String
	},
	isSubmitted: {
		type: Boolean
	},
	createdAt : {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Student', studentSchema);