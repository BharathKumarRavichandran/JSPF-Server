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
		name: {
			type: String,
			default: null
		},
		rollNumber: {
			type: String,
			default: null
		},
		department: {
			type: String,
			default: null
		},
		contactNumberCall: {
			type: String,
			default: null
		},
		contactNumberWhatsapp: {
			type: String,
			default: null
		},
		tshirtSize: {
			type: String,
			enum: ['XS','S','M','L','XL','XXL','XXXL']
		},
		introduction: {
			type: String,
			default: null
		}
	},
	certificates: {
		gradeSheetSem1: {
			type: String,
			default: null
		},
		instiCertificate: {
			type: String,
			default: null
		},
		nonInstiCertificate: {
			type: String,
			default: null
		},
		gradeSheetMOOC: {
			type: String,
			default: null
		}
	},
	abstract: {
		docLink: {
			type: String,
			default: null
		},
		projectAbstract: {
			type: String,
			default: null
		},
		supportingFiles: {
			type: Array
		}
	},
	essays: {
		mentors: {
			sop: {
				type: String,
				default: null
			},
			community: {
				type: String,
				default: null
			},
			society: {
				type: String,
				default: null
			}
		},
		final: {
			sop: {
				type: String,
				default: null
			},
			community: {
				type: String,
				default: null
			},
			society: {
				type: String,
				default: null
			}
		}
	},
	signature: {
		type: String,
		default: null
	},
	isSubmitted: {
		type: Boolean,
		default: false
	}
},{timestamps: true});

module.exports = mongoose.model('Student', studentSchema);