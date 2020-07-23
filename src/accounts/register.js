import React from 'react'

export const Register = () => {
    state = {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password2: '',
    }
    return <div className="col-md-6 m-auto">
    <div className="card card-body mt-5">
      <h2 className="text-center">Register</h2>
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            onChange={this.onChange}
            value={username}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            onChange={this.onChange}
            value={email}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={this.onChange}
            value={password}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="password2"
            onChange={this.onChange}
            value={password2}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </div>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  </div>
}