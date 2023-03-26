import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  public network: string = '';

  constructor() { }
  set(key: string, value: string) {
    localStorage.setItem(key, value)
  }
  get(key: string): any {
    const value = localStorage.getItem(key);
    return value;
  }
  remove(key: string) {
    localStorage.removeItem(key);
  }
  clearAll() {
    localStorage.clear();
  }
  setNetwork(network: string) {
    this.network = network;
  }
  getNetwork() {
    return this.network;
  }
}
