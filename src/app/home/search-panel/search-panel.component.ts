import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { State } from 'src/app/models/model';
import { NoticeService } from 'src/app/services/notice.service';
@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
})
export class SearchPanelComponent implements OnInit {
  searchForm: FormGroup;
  NoticeType: any = [];
  stateList: State[] = [];
  constructor(private notice: NoticeService) {
    this.searchForm = new FormGroup({
      searchText: new FormControl(''),
    });
  }

  ngOnInit() {
    this.getCites();
    this.getNoticeType();
  }

  onSubmit() {
    const searchText = this.searchForm.get('searchText').value;
    console.log(searchText);
  }

  //------------get data fron api------------------//
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

  //------------Notice Type dropdowns------------------//

  checkboxClicked(event: any) {
    console.log(event);
  }
  selectAll: boolean = false;
  ids: any = '';
  selectAllCheckboxes() {
    this.ids = '';
    this.selectAll = !this.selectAll;
    for (let notice of this.NoticeType) {
      notice.checked = !this.selectAll;
      if (this.selectAll) this.ids = this.ids + ',' + notice.id;
    }
    console.log(this.ids);
  }
  onCheckboxChange(notice: { name: string }, event: any) {
    if (notice.name === 'All') {
      this.selectAll = event.detail.checked;
    } else {
      if (event.detail.checked) {
        this.selectAll = this.NoticeType.every((notice) => notice.checked);
        this.ids = this.ids + ',' + event.detail.value;
      } else {
        this.selectAll = false;
      }
    }

    console.log(this.ids);
  }
  onSaveNoticeType() {}
}
