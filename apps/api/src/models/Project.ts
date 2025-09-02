import mongoose, { Schema, Document } from "mongoose";

export type ProjectType = Document & {
  projectName: string;
  clientName: string;
  description: string;
};

const projectSchema: Schema = new Schema({
  projectName: {
    type: String,
    required: true,
    trim: true,
  },

  clientName: {
    required: true,
    type: String,
    trim: true,
  },

  description: {
    required: true,
    type: String,
    trim: true,
  },
});

const Project = mongoose.model<ProjectType>('Project', projectSchema);

export default Project;
