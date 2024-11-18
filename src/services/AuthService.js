// src/services/AuthService.js
class AuthService {
  constructor() {
    this.apiKey = process.env.REACT_APP_TMDB_API_KEY;
  }

  tryLogin(email, password, saveToken = true) {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((user) => user.id === email && user.password === password);

      if (user) {
        if (saveToken) {
          localStorage.setItem('TMDb-Key', this.apiKey); // TMDB API 키 저장
          const userData = { email: user.id };
          localStorage.setItem('user', JSON.stringify(userData));
        }
        resolve({ email: user.id });
      } else {
        reject('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
    });
  }

  tryRegister(email, password) {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some((existingUser) => existingUser.id === email);

        if (userExists) {
          throw new Error('User already exists');
        }

        const newUser = { id: email, password: password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default AuthService;