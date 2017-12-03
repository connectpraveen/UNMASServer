import { Component } from '@angular/core';

// Import the DataService
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  // Define a users property to hold our user data
  users: Array<any>;  

  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService) {
    // Access the Data Service's getUsers() method we defined
    this._dataService.getUsers()
        .subscribe(res => this.getdata(this.users = res));               
       
  }
  public getdata(result)
  {
    //console.log(res);
    let lessons = result.map(data => data.catalogue[0].UNMASTraining[0].courses[0].modules[0].lessons);
    console.log(lessons);
  }
}