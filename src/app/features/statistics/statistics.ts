import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStatisticsService } from '../../core/services/admin-statistics.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css'
})
export class Statistics implements OnInit {
  constructor(public statsService: AdminStatisticsService) { }

  ngOnInit(): void {
    this.statsService.getStatistics().subscribe();
  }
}