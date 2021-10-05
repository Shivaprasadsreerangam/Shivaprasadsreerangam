const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const nodemailer = require('nodemailer');
const PORT=3001

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"us-cdbr-east-04.cleardb.com",
    user:"bec09ef1a4d548",
    password:"19fb4621",
    database:"heroku_5fec6c3626a11ee",
});
app.post("/doctordetails", (req, res) => {
    const hospital_id=req.body.hospital_id;
    console.log(hospital_id);
    db.query("select doctor_name from heroku_5fec6c3626a11ee.doctor_details where hospital_id=?;",[hospital_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });

  app.post("/treatmentSteps", (req, res) => {
    const disorder_id=req.body.disorder_id;
    const patient_id=req.body.patient_id;

    
    db.query("select spd.disorder,dtd.seq_id,dtd.link_name,dtd.link from heroku_5fec6c3626a11ee.disorder_treatment_detail dtd,\
             heroku_5fec6c3626a11ee.disorder_details spd where dtd.disorder_id=spd.disorder_id \
             and dtd.disorder_id=?",[disorder_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });

  app.post("/CheckHospital", (req, res) => {
    const hospital_name=req.body.hospital_name;
  
    db.query("select count(hospital_name) count_1 from heroku_5fec6c3626a11ee.hospital_details where hospital_name=?"
        ,[hospital_name], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        
       // if(result[0].count_1>0) {
          //res.send("Account has been created alredy for this Hospital");
        //  console.log(result[0].hospital_name,result[0].count_1);
       // }
        // console.log(result[0].count_1);
        res.send(result);
      }
    });
  });
  
  app.post("/getpatientdetails", (req, res) => {
    const patient_id=req.body.patient_id;
   
    db.query("select * from heroku_5fec6c3626a11ee.patient_details,heroku_5fec6c3626a11ee.patient_voice_disorder_details where patient_details.patient_id=patient_voice_disorder_details.patient_id and patient_details.patient_id=?;",[patient_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });
  app.post("/disorderdetails", (req, res) => {
    const hospital_id=req.body.hospital_id;
    const user_id=req.body.user_id;
   
    db.query("select dd.disorder_id,dd.disorder from heroku_5fec6c3626a11ee.disorder_details_assocation da,heroku_5fec6c3626a11ee.disorder_details dd\
    where dd.disorder_id=da.disorder_id and da.hospital_id=1 and da.customer_id=1;;",[hospital_id,user_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });

  app.post("/articulationSoundsAges", (req, res) => {
    const hospital_id=req.body.hospital_id;
    const dirthdayDate=req.body.dirthdayDate;
    console.log(dirthdayDate);
   
    
    // // where lower_age_months <= TIMESTAMPDIFF(MONTH, ?, CURDATE())\
    // // and upper_age_months >=TIMESTAMPDIFF(MONTH, ?, CURDATE()) \;"
    db.query("  select distinct sounds,lower_age_months,upper_age_months,sound_type,''as selected from heroku_5fec6c3626a11ee.articulation_sounds_ages  order by sounds;" ,[dirthdayDate,dirthdayDate], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });


  app.post("/userdetails", (req, res) => {
    const hospital_id=req.body.hospital_id;
    const pwd=req.body.pwd;
   
    db.query("select first_name,name,contact_num from heroku_5fec6c3626a11ee.spiel_user where hospital_id=?;",[hospital_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });

  app.post("/updateNewPwd", (req, res) => {

    const email_id=req.body.uname;
    const pwd=req.body.pwd;
    
    db.query("update heroku_5fec6c3626a11ee.spiel_user set default_password='N',invalid_logins=0, pwd=?  where email_id =?",[pwd,email_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        console.log(pwd);
      }
    });
  });
  app.post("/sendNewPwd", (req, res) => {

    const email_id=req.body.uname;
    const pwd=req.body.pwd;
    const body="Password has been reset";
    db.query("update heroku_5fec6c3626a11ee.spiel_user set default_password='Y',invalid_logins=0, pwd=?  where email_id =?",[pwd,email_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        console.log(pwd);
      }
    });
    
    console.log(body);
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user:'spielthemakers@gmail.com', // TODO: your gmail account
          pass: 'Spiel@12345' // TODO: your gmail password
      }
  });
  
  let mailOptions = {
    from: 'spielthemakers@gmail.com', // TODO: email sender
    to: email_id, // TODO: email receiver
    subject: 'Default Password',
    text: body.concat(pwd),
};
transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
      return console.log(err);
  }
      
      return console.log('Email sent!!!');


  });
}

  )

  app.post("/insertArticulationPatientDetails", (req, res) => {
    const patient_id=req.body.patient_id;
    const first_name=req.body.first_name;
    const middle_name=req.body.middle_name;
    const last_name=req.body.last_name;
    const Gender=req.body.Gender;
    const disorder=req.body.disorder;
    const birthday=req.body.birthday;
    const Primary_Complaint=req.body.Primary_Complaint;
    const user_name=req.body.user_name;
    const middleName=req.body.middleName;
    const LastName=req.body.LastName;
    const RelationShip=req.body.RelationShip;
    const email=req.body.email;
    const contact_no=req.body.contact_no;
    const doctor=req.body.doctor;
    const hospital_id=req.body.hospital_id;
  	const deformity_articulation=req.body.deformity_articulation;
    const deformity =req.body.deformity;
    const oral_mechanism=req.body.oral_mechanism;
    const oral_mechanism_1=req.body.oral_mechanism_1;
    const articulation_assessed=req.body.articulation_assessed;
    const articulation_assessed_1=req.body.articulation_assessed_1;
    const elicit_response_1=req.body.elicit_response_1;
    const elicit_response=req.body.elicit_response;
    const errors_noticed=req.body.errors_noticed;
    const errors_noticed_1=req.body.errors_noticed_1;
    const errors_pattern=req.body.errors_pattern;
    const errors_pattern_1=req.body.errors_pattern_1;
    const diagnosis_con_sus=req.body.diagnosis_con_sus;
    const diagnosis_con_sus_1=req.body.diagnosis_con_sus_1;
    const Confirmed_Diagnosis=req.body.Confirmed_Diagnosis;
    const Suspected_Diagnosis=req.body.Suspected_Diagnosis;
    const soundsDetails=Object.values(JSON.parse(JSON.stringify(req.body.soundsDetails)));
    const PatientSoundDisorderDetails=req.body.PatientSoundDisorderDetails;
    const Substitution_processes=req.body.Substitution_processes;
    const Syllable_Structure=req.body.Syllable_Structure;
    const assimilation_processes=req.body.assimilation_processes;
   
    console.log(Syllable_Structure);
  
const callProceudure="call insert_patient_articulation_details(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
db.query(callProceudure,[patient_id,first_name,middle_name,last_name,Gender,disorder,birthday,Primary_Complaint,user_name,middleName,LastName,RelationShip,
email,contact_no,'','',doctor,hospital_id,deformity_articulation,deformity,oral_mechanism,oral_mechanism,articulation_assessed,articulation_assessed_1,
elicit_response,elicit_response,errors_noticed,errors_pattern,errors_pattern_1,Confirmed_Diagnosis,Suspected_Diagnosis,'',PatientSoundDisorderDetails,
Substitution_processes,Syllable_Structure,assimilation_processes
],(err,result)=>{
       res.send(err);
       console.log(err);
       console.log(result);

      });
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:'spielthemakers@gmail.com', // TODO: your gmail account
            pass: 'Spiel@12345' // TODO: your gmail password
        }
    });
    let mailOptions = {
      from: 'spielthemakers@gmail.com', // TODO: email sender
      to: email, // TODO: email receiver
      subject: 'Nodemailer - Test',
      text: first_name,
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        return console.log(err);
    }
        
        return console.log('Email sent!!!');
});
});



  app.post("/accountdetails", (req, res) => {
    const user_id=req.body.user_id;
   
    db.query("select hd.hospital_name,\
              su.first_name,\
              su.second_name,\
              su.last_name,\
              su.user_expiry_date,\
              su.contact_num,\
              su.email_id,\
              hd.nusers\
  from heroku_5fec6c3626a11ee.hospital_details hd, heroku_5fec6c3626a11ee.spiel_user su where hd.hospital_id=su.hospital_id and su.id=?;",[user_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });     

  app.post("/treatment", (req, res) => {
    const disorder_id=req.body.disorder_id;
    const patient_id=req.body.patient_id;
    const firname='shiva;'
    
    db.query("select dd.disorder,dts.trt_seq_number,dts.treatment_name,dts.num_sessions,pdt.completed_date,pdt.patient_id,dd.disorder_id \
    from  heroku_5fec6c3626a11ee.disorder_details dd,heroku_5fec6c3626a11ee.disorder_treatment_steps dts  \
    left Join heroku_5fec6c3626a11ee.patient_disorder_treatment pdt on pdt.disorder_id= ? and pdt.trt_seq_number=dts.trt_seq_number and pdt.patient_id=?\
    where dd.disorder_id=dts.disorder_id order by dts.trt_seq_number ;\
    ",[disorder_id,firname], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });




app.post("/patientdetails", (req, res) => {
  const hospital_id=req.body.hospital_id;
  const patient_id=req.body.patient_id;
  console.log(hospital_id);
    db.query("select patient_id, patient_fname,patient_disorder,disorder_id,DATE_FORMAT(patient_dob,'%Y-%m-%d') patient_dob,Caretaker_fname,email_id,contact_number1 from heroku_5fec6c3626a11ee.patient_details where hospital_id ='?' and active is NULL or active='Y';",[hospital_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
       
      }
    });
  });

  
app.post("/patientdetails_1", (req, res) => {
  console.log("details")
  const hospital_id=req.body.hospital_id;
  const patient_id=req.body.patient_id;
  console.log("patientdetails_1");
  console.log(patient_id);
    db.query("select patient_id, patient_fname,patient_mName,patient_lName,patient_gender,patient_disorder,disorder_id,substr(patient_dob,1,10) as patient_dob,parimary_complain,Caretaker_fname,Caretaker_mname,Caretaker_lname,realationship,email_id,contact_number1,doctor_assigned from heroku_5fec6c3626a11ee.patient_details where  patient_id =?;",[patient_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
       
      }
      console.log("patientdetails_1");
    });
  });

  app.post("/patientdetails_2", (req, res) => {
    const hospital_id=req.body.hospital_id;
    const patient_id=req.body.patient_id;
    console.log("patientdetails_1");
    console.log(hospital_id);
      db.query("select disorder,deformity,deformity_list,Oral_mechanism_significant,articulation_assessed,elicit_response_method,errors_noticed,pattern_errors,diagnosis_confirm_suspect,diagnosis_severity,Diagnostic_terms,Substitution_processes,Syllable_Structure_processes,assimilation_processes from heroku_5fec6c3626a11ee.patient_articulation_disorder_details where patient_id =?",[patient_id], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
          console.log(result);
         
        }
      });
    });


  app.post("/fetchLoginDetails", (req, res) => {

      db.query("select login_id,email_id,hosiptal_id,max(loginTime) latest_login_time,count(login_id) num from heroku_5fec6c3626a11ee.Login_details group by login_id,email_id,hosiptal_id order by latest_login_time desc;", (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
          console.log(result);
         
        }
      });
    });

  app.post("/insertLoginDetail", (req, res) => {
    const hospital_id=req.body.hospital_id;
    const login_id=req.body.login_id;
    const email_id=req.body.email_id;

    console.log(hospital_id);
      db.query("insert into heroku_5fec6c3626a11ee.Login_details(login_id,email_id,hosiptal_id,loginTime) values(?,?,?,now());",[login_id,email_id,hospital_id], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
          console.log(result);
         
        }
      });
    });

    app.post("/deletePatientDetails", (req, res) => {
      const hospital_id=req.body.hospital_id;
      const patient_id=req.body.patient_id;
     
  
      console.log(hospital_id);
        db.query("update heroku_5fec6c3626a11ee.patient_details set active='N' where Patient_id=? and hospital_id=?",[patient_id,hospital_id], (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
            console.log(result);
           
          }
        });
      });

    app.post("/getArticulationPatientDetails", (req, res) => {
      const patient_id=req.body.patient_id;
     
  
      console.log(patient_id);
        db.query("select sound,sound_check,disorder_level from heroku_5fec6c3626a11ee.patient_sound_disorder_details where Patient_id=?;",[patient_id] , (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
            console.log(result);
           
          }
        });
      });

      
    app.post("/getFluencyPatientDetails", (req, res) => {
      const patient_id=req.body.patient_id;
     
  
      console.log(patient_id);
        db.query("select cause_neurogenic_disorder,family_history,contacted_stutterers,primary_features_observed,secondary_features_observed,Respiration,phonatory,articulatory,\
        sample_speech,Percentage_syllables_stuttered,stuttering_duration_average,overall_speaking_rate,articulatory_rate,nonstuttered_average_duration,\
        nonstuttered_longest_length,nonstuttered_longest_duration,nonstuttered_average_length,Naturalness_rating_scale,language_changes,language,code_switching_noticed,\
        test_materials,psychological_evaluation,diagnosis_confirmed_suspected,Suspected_Diagnostic,Confirmed_Diagnosis from heroku_5fec6c3626a11ee.patient_fluency_disorder_details where patient_id =?;",
        [patient_id] , (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
            console.log(result);
           
          }
        });
      });


      app.post("/getChildLanguageDisorderPatientDetails", (req, res) => {
        const patient_id=req.body.patient_id;
        const hospital_id=req.body.hospital_id;
       
    
        console.log(patient_id);
          db.query("select language_assessment,pre_verb_skill_observation,receptive_vocabulary,expressive_vocabulary, pre_reading_skills,developmental_language,\
          advanced_language,mother_tongue,other_lanugauge,community_lanugauge,client_assessed_tool,recepitive_tool_language,expressive_tool_language,\
          client_assessed_disorder_specific_tool,disorder_suspected,language_delay_suspected,language_delay_secondary_disorder,consq_language_delay_secondary_disorder,diagnosis_confirmed_suspected\
          from heroku_5fec6c3626a11ee.patient_child_language_disorder where hospital_id = ? and patient_id=?;",
          [hospital_id,patient_id] , (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send(result);
              console.log(result);
             
            }
          });
        });

        app.post("/getAudultLanguageDisorderPatientDetails", (req, res) => {
          const patient_id=req.body.patient_id;
          const hospital_id=req.body.hospital_id;
         
      
          console.log(patient_id);
            db.query("select language_assessment,significant_medical_history,morbid_change,adult_neurogenic_communication_disorder,dementia,right_hemisphere_damage,\
            alzheimer,parkinsons,dysphagia,apraxia,test_material,test_meterial_file,significant_issue_speech,diagnosis_confirmed_suspected,\
            from heroku_5fec6c3626a11ee.patient_adult_language_disorder where patient_id=? and hospital_id=?;)",
            [hospital_id,patient_id] , (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
                console.log(result);
               
              }
            });
          });



app.post("/login", (req, res) => {
    const uname=req.body.uname;
    const psw=req.body.psw;
    console.log("uname");
     const sqlFetch="select id,email_id,name,invalid_logins,hospital_id,role,default_password from heroku_5fec6c3626a11ee.spiel_user where (email_id=? or id =?) and pwd=? ;"
     db.query(sqlFetch,[uname,uname,psw],(err,result)=>{
      if (err) {
        console.log(err);
        res.send("Invalid user name or password");
      } else {
        res.send(result);
        console.log(result);
       
      }
});
});

app.post("/updateInvalidLogin", (req, res) => {
  const uname=req.body.uname;
  const psw=req.body.psw;
  console.log("abcdf");
  
  db.query("update heroku_5fec6c3626a11ee.spiel_user set invalid_logins=0 where email_id =?",[uname], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      console.log("abcdf12233");
    }
  });
})


app.post("/checkInvalidAttemepts", (req, res) => {
  const uname=req.body.uname;
  const psw=req.body.psw;
  console.log("invalid attempts");

  //db.query("SET SQL_SAFE_UPDATES = 0;")
  console.log("invalid attempts1234");
  db.query("update heroku_5fec6c3626a11ee.spiel_user set invalid_logins=invalid_logins+1 where email_id =?",[uname], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      
   const sqlFetch="select id,email_id,name,invalid_logins,hospital_id,role from heroku_5fec6c3626a11ee.spiel_user where (email_id=?) ;"
   db.query(sqlFetch,[uname],(err,result)=>{
    if (err) {
      console.log(err);
      res.send("Invalid password");
    } else {
      res.send(result);
      console.log(result);
     
    }
}); 
     
     
    }
  });

});




app.post("/userExpire", (req, res) => {
  const uname=req.body.uname;
  const psw=req.body.psw;
  console.log(uname);
   const sqlFetch="select id,email_id,name,invalid_logins,hospital_id,role,substr(user_expiry_date,1,10) as user_expiry_date from heroku_5fec6c3626a11ee.spiel_user where (email_id=? or id =?) and pwd=? and user_expiry_date < current_date();"
   db.query(sqlFetch,[uname,uname,psw],(err,result)=>{
    if (err) {
      console.log(err);
      res.send("Invalid user name or password");
    } else {
      res.send(result);
      console.log(result);
     
    }
});
});

app.post("/default_password", (req, res) => {
  const uname=req.body.uname;
  const psw=req.body.psw;
  console.log(uname);
   const sqlFetch="select id,email_id,name,invalid_logins,hospital_id,role,substr(user_expiry_date,1,10) as user_expiry_date from heroku_5fec6c3626a11ee.spiel_user where (email_id=? or id =?) and pwd=? and user_expiry_date < current_date();"
   db.query(sqlFetch,[uname,uname,psw],(err,result)=>{
    if (err) {
      console.log(err);
      res.send("Invalid user name or password");
    } else {
      res.send(result);
      console.log(result);
     
    }
});
});


app.post("/insert", (req, res) => {
    const patient_id=req.body.patient_id;
    const first_name=req.body.first_name;
    const middle_name=req.body.middle_name;
    const last_name=req.body.last_name;
    const Gender=req.body.Gender;
    const disorder=req.body.disorder;
    const birthday=req.body.birthday;
    const Primary_Complaint=req.body.Primary_Complaint;
    const user_name=req.body.user_name;
    const middleName=req.body.middleName;
    const LastName=req.body.LastName;
    const RelationShip=req.body.RelationShip;
    const email=req.body.email;
    const contact_no=req.body.contact_no;
    const doctor=req.body.doctor;
    const hospital_id=req.body.hospital_id;
    const vocal_abuse=req.body.vocal_abuse;
    const vocal_misue=req.body.vocal_misue;
    const prof_voice_user_level=req.body.prof_voice_user_level;
    const medical_etiology=req.body.medical_etiology;
    const neurogenic_disorder=req.body.neurogenic_disorder;
    const respiratory_disorders=req.body.respiratory_disorders;
    const voice_usage=req.body.voice_usage;
    const task=req.body.task;
    const grabs=req.body.grabs;
    const pitch=req.body.pitch;
    const loudness=req.body.loudness;
    const quality=req.body.quality;
    const resonance=req.body.resonance;
    const articulation=req.body.articulation;
    const prosody=req.body.prosody;
    const instrumental_analysis=req.body.instrumental_analysis;
    const instrumental_analysis1=req.body.instrumental_analysis1;
    const multi_Dimensional_Voice_Profile=req.body.multi_Dimensional_Voice_Profile;
    const praat=req.body.praat;
    const aerodynamic=req.body.aerodynamic;
    const diagnosis_terms=req.body.diagnosis_terms;
    const deformity_articulation=req.body.deformity_articulation;
    const deformity =req.body.deformity;
    const oral_mechanism=req.body.oral_mechanism;
    const oral_mechanism_1=req.body.oral_mechanism_1;
    const articulation_assessed=req.body.articulation_assessed;
    const articulation_assessed_1=req.body.articulation_assessed_1;
    const elicit_response_1=req.body.elicit_response_1;
    const errors_noticed=req.body.errors_noticed;
    const errors_noticed_1=req.body.errors_noticed_1;
    const diagnosis_con_sus=req.body.diagnosis_con_sus;
    const diagnosis_con_sus_1=req.body.diagnosis_con_sus_1;
    const Confirmed_Diagnosis=req.body.Confirmed_Diagnosis;
    const Suspected_Diagnosis=req.body.Suspected_Diagnosis;
    const PatientSoundDisorderDetails=req.body.PatientSoundDisorderDetails;
    console.log(hospital_id);
  
const callProceudure="call insert_patient_details(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
db.query(callProceudure,[patient_id,first_name,middle_name,Gender,disorder,birthday,Primary_Complaint,user_name,middleName,LastName,RelationShip,email,contact_no,'','',doctor,hospital_id,vocal_abuse,vocal_misue,prof_voice_user_level,medical_etiology,neurogenic_disorder,respiratory_disorders,voice_usage,task,grabs,pitch,loudness,quality,resonance,articulation,prosody,instrumental_analysis,instrumental_analysis1,multi_Dimensional_Voice_Profile,praat,aerodynamic,diagnosis_terms,deformity_articulation,deformity,oral_mechanism_1,articulation_assessed_1,elicit_response_1,errors_noticed,errors_noticed_1,diagnosis_con_sus,diagnosis_con_sus_1,Confirmed_Diagnosis,Suspected_Diagnosis,PatientSoundDisorderDetails],(err,result)=>{
         res.send(err);
         console.log(err);

        });
});


app.post("/createAccount", (req, res) => {
  const hospital_id=req.body.hospital_id;
  const nusers=req.body.nusers;
  const uName=req.body.uName;
  const mName=req.body.mName;
  const lName=req.body.lName;
  const hName=req.body.hName;
  const duration=req.body.duration;
  const duration1=req.body.duration1;
  const disorder="Voice";
  const Emaild=req.body.Emaild;
  const Phno=req.body.Phno;
  const pwd=req.body.pwd;
   

 
  
console.log("create account Emaild");

const callProceudure="call create_account(?,?,?,?,?,?,?,?,?,?,?,?)"
db.query(callProceudure,[hospital_id,uName,mName,lName,hName,duration,duration1,disorder,Emaild,Phno,nusers,pwd],(err,result)=>{
       res.send(err);
       console.log(err);
       console.log(result);

      });
    
    	const body="default password for login the product";
	let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user:'spielthemakers@gmail.com', // TODO: your gmail account
          pass: 'Spiel@12345' // TODO: your gmail password
      }
  });
  
  let mailOptions = {
    from: 'spielthemakers@gmail.com', // TODO: email sender
    to: Emaild, // TODO: email receiver
    subject: 'Default Password ',
    text: body.concat(pwd),
};
transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
      return console.log(err);
  }
      
      return console.log('Email sent!!!');


  });
});


app.post("/insertFluencyPatientDetails", (req, res) => {
  console.log("entered Index");
  const patient_id=req.body.patient_id;
  const first_name=req.body.first_name;
  const middle_name=req.body.middle_name;
  const last_name=req.body.last_name;
  const Gender=req.body.Gender;
  const disorder=req.body.disorder;
  const birthday=req.body.birthday;
  const Primary_Complaint=req.body.Primary_Complaint;
  const user_name=req.body.user_name;
  const middleName=req.body.middleName;
  const LastName=req.body.LastName;
  const RelationShip=req.body.RelationShip;
  const email=req.body.email;
  const contact_no=req.body.contact_no;
  const doctor=req.body.doctor;
  const hospital_id=req.body.hospital_id;
  const cause_neurogenic_disorder= req.body.cause_neurogenic_disorder; 
const family_history= req.body.family_history; 
const contacted_stutterers= req.body.contacted_stutterers; 
const primary_features_observed= req.body.primary_features_observed; 
const secondary_features_observed= req.body.secondary_features_observed; 
const Respiration= req.body.Respiration; 
const phonatory= req.body.phonatory; 
const articulatory= req.body.articulatory; 
const sample_speech= req.body.sample_speech; 
const Percentage_syllables_stuttered= req.body.Percentage_syllables_stuttered; 
const stuttering_duration_average= req.body.stuttering_duration_average; 
const overall_speaking_rate= req.body.overall_speaking_rate; 
const articulatory_rate= req.body.articulatory_rate; 
const nonstuttered_average_duration= req.body.nonstuttered_average_duration; 
const nonstuttered_longest_length= req.body.nonstuttered_longest_length; 
const nonstuttered_longest_duration= req.body.nonstuttered_longest_duration; 
const nonstuttered_average_length= req.body.nonstuttered_average_length; 
const Naturalness_rating_scale= req.body.Naturalness_rating_scale; 
const language_changes= req.body.language_changes; 
const language= req.body.language; 
const code_switching_noticed= req.body.code_switching_noticed; 
const test_materials= req.body.test_materials; 
const psychological_evaluation= req.body.psychological_evaluation; 
const diagnosis_confirmed_suspected= req.body.diagnosis_confirmed_suspected; 
const Suspected_Diagnostic= req.body.Suspected_Diagnostic; 
const Confirmed_Diagnosis =req.body.Confirmed_Diagnosis;

 

const callProceudure="call heroku_5fec6c3626a11ee.insert_patient_fluency_details(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
db.query(callProceudure,[patient_id,
  first_name,
  middle_name,
  last_name,
  Gender,
  disorder,
  birthday,
  Primary_Complaint,
  user_name,
  middleName,
  LastName,
  RelationShip,
  email,
  contact_no,
  '',
  '',doctor
  ,hospital_id,
  cause_neurogenic_disorder,
family_history,
contacted_stutterers,
primary_features_observed,
  secondary_features_observed,
  Respiration,
  phonatory,
  articulatory,
  sample_speech,
  Percentage_syllables_stuttered,
  stuttering_duration_average,
  overall_speaking_rate,
  articulatory_rate,
  nonstuttered_average_duration,
  nonstuttered_longest_length,
  nonstuttered_longest_duration,
  nonstuttered_average_length,
  Naturalness_rating_scale,
  language_changes,
  language,
  code_switching_noticed,
  test_materials,
  psychological_evaluation,
  diagnosis_confirmed_suspected,
  Suspected_Diagnostic,
  Confirmed_Diagnosis
],(err,result)=>{
     res.send(err);
     console.log(err);
     console.log(result);

    });
});

app.post("/insertLanguageDisorderPatientDetails", (req, res) => {
  console.log("entered Index");
  const patient_id=req.body.patient_id;
  const first_name=req.body.first_name;
  const middle_name=req.body.middle_name;
  const last_name=req.body.last_name;
  const Gender=req.body.Gender;
  const disorder=req.body.disorder;
  const birthday=req.body.birthday;
  const Primary_Complaint=req.body.Primary_Complaint;
  const user_name=req.body.user_name;
  const middleName=req.body.middleName;
  const LastName=req.body.LastName;
  const RelationShip=req.body.RelationShip;
  const email=req.body.email;
  const contact_no=req.body.contact_no;
  const doctor=req.body.doctor;
  const hospital_id=req.body.hospital_id;
  const language_assessment=req.body.language_assessment ;
const significant_medical_history =req.body. significant_medical_history;
const morbid_change =req.body. morbid_change;
const adult_neurogenic_communication_disorder=req.body.adult_neurogenic_communication_disorder ;
const dementia =req.body. dementia;
const right_hemisphere_damage=req.body.right_hemisphere_damage ;
const alzheimer= req.body. alzheimer;
const parkinsons =req.body. parkinsons;
const dysphagia=req.body.dysphagia ;
const apraxia= req.body. apraxia;
const test_material =req.body. test_material;
const test_meterial_file=req.body.test_meterial_file ;
const significant_issue_speech =req.body. significant_issue_speech;
const pre_verb_skill_observation =req.body.pre_verb_skill_observation  ;
const receptive_vocabulary =req.body.receptive_vocabulary  ;
const expressive_vocabulary=req.body.expressive_vocabulary ;
const pre_reading_skills=req.body.pre_reading_skills ;
const developmental_language=req.body.developmental_language ;
const advanced_language=req.body.advanced_language ;
const mother_tongue =req.body.mother_tongue  ;
const other_lanugauge =req.body.other_lanugauge  ;
const community_lanugauge=req.body.community_lanugauge ;
const client_assessed_tool=req.body.client_assessed_tool ;
const recepitive_tool_language =req.body. recepitive_tool_language;
const expressive_tool_language=req.body. expressive_tool_language;
const client_assessed_disorder_specific_tool=req.body.client_assessed_disorder_specific_tool ;
const disorder_suspected =req.body.disorder_suspected  ;
const language_delay_suspected=req.body.language_delay_suspected ;
const language_delay_secondary_disorder =req.body.language_delay_secondary_disorder  ;
const consq_language_delay_secondary_disorder =req.body.consq_language_delay_secondary_disorder  ;
const diagnosis_confirmed_suspected= req.body. diagnosis_confirmed_suspected;
  

 

const callProceudure="call heroku_5fec6c3626a11ee.insert_patient_language_disorder_details(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
db.query(callProceudure,[patient_id,
  first_name,
  middle_name,
  last_name,
  Gender,
  disorder,
  birthday,
  Primary_Complaint,
  user_name,
  middleName,
  LastName,
  RelationShip,
  email,
  contact_no,
  '',
  '',
  doctor,
  hospital_id,
language_assessment ,
pre_verb_skill_observation  ,
receptive_vocabulary  ,
expressive_vocabulary ,
pre_reading_skills ,
developmental_language ,
advanced_language ,
mother_tongue  ,
other_lanugauge  ,
community_lanugauge ,
client_assessed_tool ,
recepitive_tool_language,
expressive_tool_language,
client_assessed_disorder_specific_tool ,
disorder_suspected  ,
language_delay_suspected ,
language_delay_secondary_disorder  ,
consq_language_delay_secondary_disorder  ,
diagnosis_confirmed_suspected,
significant_medical_history,
morbid_change,
adult_neurogenic_communication_disorder ,
dementia,
right_hemisphere_damage ,
alzheimer,
parkinsons,
dysphagia ,
apraxia,
test_material,
test_meterial_file ,
significant_issue_speech

 
],(err,result)=>{
     res.send(err);
     console.log(err);
     console.log(result);

    });
});



app.listen(process.env.PORT||PORT,()=>{
    console.log(`running port ${PORT}`);
});

