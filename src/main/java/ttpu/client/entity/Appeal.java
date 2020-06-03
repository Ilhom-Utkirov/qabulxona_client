package ttpu.client.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

/**
 * @author Mr_Inspiration
 * @since 19.01.2020
 */
@Entity
@Table(name = "appael")
public class Appeal {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "surname")
    private String surname;

    @Column(name = "name")
    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "student_id")
    private String studentId;

    @Lob
//    @Column(name = "appeal_text" ,  length = 100000 )
    @Column(name = "appeal_text" ,  columnDefinition = "LONGBLOB", length = 100000 )
    private String appaelText;

    @Column(name = "appeal_type")
    private String appealType;

    @Column(name = "student_email")
    private String StudentEmail;

    @Column(name = "date_created", columnDefinition = "TIMESTAMP")
    private Timestamp dateCreated;

    private String filenames;

    public Appeal(){

    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getAppaelText() {
        return appaelText;
    }

    public void setAppaelText(String appaelText) {
        this.appaelText = appaelText;
    }

    public String getAppealType() {
        return appealType;
    }

    public void setAppealType(String appealType) {
        this.appealType = appealType;
    }

    public String getStudentEmail() {
        return StudentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        StudentEmail = studentEmail;
    }

    public Timestamp getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Timestamp dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getFilenames() {
        return filenames;
    }

    public void setFilenames(String filenames) {
        this.filenames = filenames;
    }
}
