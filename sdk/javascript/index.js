export class IdentityFirewallClient {
  constructor(config = {}) { this.endpoint = config.endpoint || 'http://localhost:5000'; }
}