package ttpu.client.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import ttpu.client.entity.Appeal;
import ttpu.client.repository.AppealRepository;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.Date;


/**
        * @author Mr_Inspiration
        * @since 19.01.2020
        */
@RequestMapping("/")
@Controller
public class MainController {

    @Autowired
    private AppealRepository appealRepository;


    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String get(Model model) {
     Appeal appeal = new Appeal();
     model.addAttribute("appeal",appeal);
     return "index";
    }

    @RequestMapping(value = "/appeal/save", method = RequestMethod.POST )
    public String saveAppaal(Appeal appeal) {
        Date date = new Date();
        appeal.setDateCreated(new Timestamp(date.getTime()));
         appealRepository.save(appeal);

        return "redirect:/" ;
    }







    /*
    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public String singleFileUpload(@RequestParam("file")MultipartFile file,
                                   RedirectAttributes redirectAttributes){
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("message", "Please select a file to upload");
            return "redirect:uploadStatus";
        }

        try {

            // Get the file and save it somewhere
            byte[] bytes = file.getBytes();
            Path path = Paths.get(UPLOADED_FOLDER + file.getOriginalFilename());
            Files.write(path, bytes);

            redirectAttributes.addFlashAttribute("message",
                    "You successfully uploaded '" + file.getOriginalFilename() + "'");

        } catch (IOException e) {
            e.printStackTrace();
        }

        return "redirect:/uploadStatus";
    }


    @RequestMapping(value = "/uploadStatus", method = RequestMethod.GET)
    public String uploadStatus() {
        return "uploadStatus";
    }*/









}
