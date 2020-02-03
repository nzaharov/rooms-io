import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketclientComponent } from './socketclient.component';

describe('SocketclientComponent', () => {
  let component: SocketclientComponent;
  let fixture: ComponentFixture<SocketclientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocketclientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
