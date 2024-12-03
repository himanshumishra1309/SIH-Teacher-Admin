import mongoose, { Schema } from 'mongoose';

const domainPointSchema = new Schema(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
      enum:['International Journal', 'National Journal', 'Regional Journal' ,'International Book', 'National Book', 'Regional Book', 'International Chapter', 'National Chapter', 'Regional Chapter', 'International Conference', 'National Conference', 'Regional Conference', 'International Patent', 'National Patent', 'Regional Patent', 'Major Projects', 'Minor Projects', 'Mtech Students Guided', 'PhD Students Guided', "Organizer National Event", "Organizer International Event", "Organizer State Event", "Organizer College Event", "Speaker National Event", "Speaker International Event", "Speaker State Event", "Speaker College Event", "Judge National Event", "Judge International Event", "Judge State Event", "Judge College Event", "Coordinator National Event", "Coordinator International Event", "Coordinator State Event", "Coordinator College Event", "Volunteer National Event", "Volunteer International Event", "Volunteer State Event", "Volunteer College Event", "Evaluator National Event", "Evaluator International Event", "Evaluator State Event", "Evaluator College Event", "Panelist National Event", "Panelist International Event", "Panelist State Event", "Panelist College Event", "Mentor National Event", "Mentor International Event", "Mentor State Event", "Mentor College Event", "Session Chair National Event", "Session Chair International Event", "Session Chair State Event", "Session Chair College Event", "Reviewer National Event", "Reviewer International Event", "Reviewer State Event", "Reviewer College Event", "International Expert Lecture", "National Expert Lecture", "State Expert Lecture", "International Seminar Attended", "National Seminar Attended", "State Seminar Attended", '1-Theory', '2-Theory', '3-Theory', '4-Theory', '1-Practical', '2-Practical', '3-Practical', '4-Practical', 'STTP_1_DAY', 'STTP_2_3_DAYS', 'STTP_4_5_DAYS', 'STTP_1_WEEK', 'STTP_2_WEEKS', 'STTP_3_WEEKS', 'STTP_4_WEEKS', 'Seminar', 'Ongoing Funded Above ₹10 Lakh Research', 'Ongoing Funded Below ₹10 Lakh Research','Industrial-Visit-Other', 'Wookshop-Conducted-Other', 'Extra-Course-Studied-Other', 'Made-Study-Materials-Other', 'Miscellaneous', 'Task-Points-Other'],
    },
    points: {
      type: Number,
      required: true, // e.g., 4 for InternationalJournal
      min: 0,
    },
  },
  { timestamps: true }
);

export const DomainPoint = mongoose.model('DomainPoint', domainPointSchema);
