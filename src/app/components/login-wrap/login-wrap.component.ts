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


  login() {
    const usrElement = document.querySelector('#username');
    const pwElement = document.querySelector('#password');

    if (usrElement instanceof HTMLInputElement && pwElement instanceof HTMLInputElement) {

      if (usrElement.value !== "" && usrElement.value !== "") {
        fetch('https://api.kickbase.com/user/login', {
          method: "POST",
          headers: {
            'accept': 'application/json',
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            "username": usrElement.value,
            "password": pwElement.value,
            "ext": false
          })
        })
          .then((response) => {
            console.log(response);
          })
      }
    }
  }
}
