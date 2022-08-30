import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-wrap',
  templateUrl: './login-wrap.component.html',
  styleUrls: ['./login-wrap.component.scss']
})
export class LoginWrapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  login($event : Event) {
    $event.preventDefault();
    const usrElement = document.querySelector('#username');
    const pwElement = document.querySelector('#password');

    if (usrElement instanceof HTMLInputElement && pwElement instanceof HTMLInputElement) {

      if (usrElement.value !== "" && pwElement.value !== "") {
        fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/loginUser?username=${usrElement.value}&password=${pwElement.value}`, {
          method : "GET",
          redirect : "follow"
        })
          .then(async (response) => {
            if (response.status === 200) {
              let rawText = await response.text()
              let json = JSON.parse(rawText);
              console.log(json);
            }
          })
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      }
    }
  }
}
