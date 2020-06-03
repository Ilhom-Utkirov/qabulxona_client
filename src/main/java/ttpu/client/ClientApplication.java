package ttpu.client;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import ttpu.client.controller.FileUploadControllerMin;

import java.io.File;

/**
 * @author Mr_Inspiration
 * @since 19.01.2020
 */

@SpringBootApplication
@EnableConfigurationProperties
@ComponentScan({"ttpu.client","ttpu.client.config","ttpu.client.entity","ttpu.client.repository","ttpu.client.controller"})
public class ClientApplication extends SpringBootServletInitializer {

    //to be able to deployed to tomcat
/*
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ClientApplication.class);
    }



    public static void main(String[] args) {
        new File(FileUploadControllerMin.uploadDirectory).mkdir();
        SpringApplication.run(ClientApplication.class, args);


    }*/

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ClientApplication.class);
    }


    public static void main(String[] args) {
        //new File(FileUploadControllerMin.uploadDirectory).mkdir();
        SpringApplication.run(ClientApplication.class, args);
    }
    private static SpringApplicationBuilder configureApplication(SpringApplicationBuilder builder) {
        return builder.sources(ClientApplication.class).bannerMode(Banner.Mode.OFF);
    }

/* //from stack overflow
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return configureApplication(builder);
    }

    public static void main(String[] args) {
        configureApplication(new SpringApplicationBuilder()).run(args);
    }

    private static SpringApplicationBuilder configureApplication(SpringApplicationBuilder builder) {
        return builder.sources(Application.class).bannerMode(Banner.Mode.OFF);
    }
*/


}
