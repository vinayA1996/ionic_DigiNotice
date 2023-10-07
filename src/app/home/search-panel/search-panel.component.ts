import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { State } from 'src/app/models/model';
import { NoticeService } from 'src/app/services/notice.service';
@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
})
export class SearchPanelComponent  implements OnInit {

  searchForm: FormGroup;
  NoticeType: any = [];
  stateList:State[]=[];
  constructor(  private notice: NoticeService,) {
    this.searchForm = new FormGroup({
      searchText: new FormControl('')
    });
  }

  ngOnInit() {
    this.getCites();
    this.getNoticeType();
  }

  onSubmit() {
    const searchText = this.searchForm.get('searchText').value;
    console.log(searchText)
  }
  //------------dropdowns


  getNoticeType() {
    this.notice.getNoticeType().subscribe((r) => {
      this.NoticeType = r;
      this.NoticeType = this.NoticeType.filter(
        (notice) => notice.isActive === true
      );
    });
  }
  getCites() {
    this.notice.getCities(72).subscribe((r: State[]) => {
      this.stateList = r;
    });
  }

  checkboxClicked(event:any){
    console.log("ee"+event)
  }


}
