import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../entity/User";
import {RegistrationRequest} from "../entity/RegistrationRequest";
import {Response} from "../entity/Response";

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient) {}

  public find(name: string): Observable<User[]> {
    return this.http.get<User[]>("/api/users", {
      params: {
        name: name
      }
    });
  }

  public register(request: RegistrationRequest): Observable<Response> {
    return this.http.post<Response>("/api/user", request);
  }

  public login(user: User): Observable<void> {
    let formData = new FormData();
    // @ts-ignore
    formData.append("username", user.login)
    // @ts-ignore
    formData.append("password", user.password)
    return this.http.post<void>("/api/login", formData);
  }

  public logout(): Observable<void> {
    return this.http.get<void>("/api/logout");
  }

}
