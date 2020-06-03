package ttpu.client.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import ttpu.client.entity.Appeal;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * @author Mr_Inspiration
 * @since 19.01.2020
 */

//@Controller
//@RequestMapping(value = "/upload")
public class FileUploadControllerMin {

    //public static String uploadDirectory =System.getProperty("user.dir")+"/uploads";

   //@RequestMapping(value = "/",method = RequestMethod.POST)
   /*
    public void upload(Model model, @RequestParam("files") MultipartFile[] files, Appeal appeal) {

        StringBuilder fileNames = new StringBuilder();



        for (MultipartFile file : files) {
            Path fileNameAndPath = Paths.get(uploadDirectory, file.getOriginalFilename());

            fileNames.append(file.getOriginalFilename()+" ");
            try {
                Files.write(fileNameAndPath, file.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
        */
        //model.addAttribute("msg", "Successfully uploaded files "+fileNames.toString());
        //return "redirect:/";
    //}

}
