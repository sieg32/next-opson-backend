import { ProjectService } from '../services/project/basic.service';
import Projects from '../models/projects/project.model';
import { ProjectDataText, ProjectUpdateData } from '../types/controllers/project.type';
import { Request, Response } from 'express';
import logger from '../config/logger';
import FileService from '../services/project/file.service';
import s3 from '../config/s3';
import Images from '../models/projects/Image.model';
import Brochures from '../models/projects/brochure.model';

const projectService = new ProjectService(Projects);
const fileService = new FileService(s3)


export const getAllProjects = async (req: Request, res: Response):Promise<void > => {
    try {
       
        const data = await Projects.findAll({chr:[Images, Brochures]});
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}


// export const getProjectById = async (req: Request, res: Response):Promise<void > => {
//     try {
//         const { id } = req.params;
//         const project = await getProjectById(id);
//         if (!project) {
//             res.status(404).json({ error: 'Project not found' });
//             return ;
//         }
//         res.json(project);
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// }



export const addProjectText=async (req:Request, res:Response) : Promise<void>=>{
try {
    
  
  const projectData:ProjectDataText = req.body;
  console.log(projectData)

    const project =await projectService.addProjectText(projectData);


    if(project.project_id){
        res.status(201).json({success:true, message:'Created', datta: project})
    }

} catch (error) {
    logger.error("error creating project", error)
    res.status(500).json({ success: false, message: "Internal server error" })
    
}

}



export const updateProjectTextInfo = async (req: Request, res: Response):Promise<void> => {
    try {
      // Extract project ID from the URL parameters
      const { projectId } = req.params;
  
      // Extract the builder's ID from the token in `res.locals`
     
  
      // Extract the project update data from the request body
      const updateData:ProjectUpdateData = req.body;
  
      // Call the service to update the project
      const updatedProject = await projectService.updateProjectTextInfo(
        projectId,
       
        updateData
      );
  
      // If the update is successful, send a success response
       res.status(200).json({
        success: true,
        message: "Project textual information updated successfully",
        data: updatedProject,
      });
    } catch (error) {
      logger.error("Error updating project textual info:", error);
  
      // Handle errors: differentiate between 'Not Found', 'Unauthorized', and 'Internal Server Error'
      if (error.message === "Project not found") {
         res.status(404).json({ success: false, message: "Project not found" });
      }else if (error.message === "User unauthorized, token verification failed") {
         res.status(401).json({ success: false, message: "Unauthorized" });
      }else{

          res.status(500).json({ success: false, message: "Internal server error" });
      }
  
      // If other errors occur, send a 500 Internal Server Error response
    }
  };



  export const addImages = async (req: Request, res: Response): Promise<void> => {
    try {
      // Transform and validate request body using DTO
    
        const projectId =  req.params.projectId
        const imageFiles= req.files
    


      

      // Call the service layer to add images
      const uploadedImages = await fileService.addImages(projectId, imageFiles);

       res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: uploadedImages,
      });
      
    } catch (error) {
      console.error('Error uploading images:', error);

       res.status(500).json({ success: false, msg: 'Internal server error' });
      return
    }
  };



export const addBrochureController = async (req: Request, res: Response):Promise<void> => {
    try {
      const { projectId } = req.params;  // Assuming projectId is passed as a URL parameter
  
      // Check if a file has been uploaded
      if (!req.files) {
        return res.status(400).json({
          success: false,
          message: 'No brochure file found in the request',
        });
      }
  
      // Call the ImageService to upload the brochure
      const brochureData = await fileService.addBrochure(projectId, req.files);
  
      res.status(200).json({
        success: true,
        message: 'Brochure uploaded successfully',
        data: brochureData,
      });
    } catch (error) {
      console.error('Error uploading brochure:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload brochure',
        error: error.message,
      });
    }
  };