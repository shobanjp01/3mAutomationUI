import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NewPassAPIsService} from '../APIs/new-pass-apis.service';
import {Router,ActivatedRoute} from '@angular/router';

declare var jquery:any;
declare var bootbox:any;
declare var $ :any;
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  environmentOptions:any;
  title:String;
  environmentList:any;
  hostDetailsDiv:Boolean;
  environment:String;
  submitBtn:String;
  environmentName:String;
  updatePass:Boolean;
  constructor(private route:Router,private newPassApi:NewPassAPIsService,private routeParams:ActivatedRoute) { 
    
  }

  ngOnInit() {
    this.hostDetailsDiv=false;
    this.routeParams.params.subscribe( params =>{
      //console.log(params) 
      if(params.page=="new"){
        this.updatePass=false;
        this.title="New Password";
      }
      else{
        this.updatePass=true;
        this.title="Change Password";
      }
    });
    
    this.newPassApi.getEnvironmentList()
    .subscribe(res=>{
      console.log(res);
      this.environmentOptions=res;
    })
    
    this.environmentList=[];
    
       
    this.environment="pleaseSelect";
  }

  saveNewPass(){
    this.routeParams.params.subscribe( params =>{
      //console.log(params) 
      if(params.page=="new"){
    console.log(this.environmentList);
    this.newPassApi.savePass(this.environmentList)
    .subscribe(res=>{
      bootbox.alert("Saved Succesfully");
    })
  }
  else{
    bootbox.confirm("<label>Are you sure, you want to update Server Files</label>",(result)=>{
      if(result==true){  
    this.newPassApi.changeServerFile(this.environmentList)
    .subscribe(res=>{
      bootbox.alert("Saved Succesfully");
    })
  }
});
  }
});
  }
  

  selectEnv(){
    var env=this.environment.split(',');
    this.environmentName=env[1];
    this.routeParams.params.subscribe( params =>{
      if(params.page=="new"){
        this.newPassApi.readServerFile(env[0])
    .subscribe(res=>{
      this.environmentList=res;
      console.log(res);
      this.hostDetailsDiv=true;
      this.submitBtn="Save";
      //this.environmentName=env;
    });
      }
      else{
        this.newPassApi.getNewPasswordList(env[0])
        .subscribe(res=>{
          if(res.id!=0){
          this.environmentList=res;
          console.log(res);
          this.hostDetailsDiv=true;
          this.submitBtn="Change Server Files";
          }
          else{
            this.hostDetailsDiv=false;
            bootbox.alert("No record found.Please add it from new password page");
          }
        });
      }
    });   
  }

  backup(){
    bootbox.confirm("<label>Are you sure, you want to take Server File Backup</label>",(result)=>{
      if(result==true){  
    this.newPassApi.backupServerFile(this.environmentList)
    .subscribe(res=>{
      bootbox.alert("File Backup done succesfully");
    })
  }
  });
  }

  crontabBackup(){
    bootbox.confirm("<label>Are you sure, you want to take Crontab Backup & Remove from Server</label>",(result)=>{
      if(result==true){  
    this.newPassApi.crontabBackup(this.environmentList)
    .subscribe(res=>{
      bootbox.alert("Crontab Backup done succesfully");
    }) 
  }
});
  }

  createCrontab(){
    bootbox.confirm("<label>Are you sure, you want to create Crontab on Server</label>",(result)=>{
      if(result==true){  
    this.newPassApi.createCrontab(this.environmentList)
    .subscribe(res=>{
      bootbox.alert("Crontab Created succesfully");
    }) 
  }
  });
  }
  selectAllNode(status){
    if(status==true){
      for(var i=0;i<this.environmentList.node.length;i++)
      {
         this.environmentList.node[i].isNode=true;
      }
     }
     else{
       for(var i=0;i<this.environmentList.node.length;i++)
      {
         this.environmentList.node[i].isNode=false;
      }
     }    

 
     
   }
}
