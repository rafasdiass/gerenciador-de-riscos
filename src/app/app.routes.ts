import { Routes } from '@angular/router';
import { HomeComponent } from './system/home/home.component';
import { DashboardComponent } from './system/dashboard/dashboard.component';
import { OperationsComponent } from './system/operations/operations.component';
import { SettingsComponent } from './system/settings/settings.component';
import { HistoryComponent } from './system/history/history.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // Rota para a página inicial (Home)
  { path: 'dashboard', component: DashboardComponent }, // Rota para o Dashboard
  { path: 'operations', component: OperationsComponent }, // Rota para Operações
 
  { path: 'settings', component: SettingsComponent }, // Rota para Configurações
  { path: 'history', component: HistoryComponent }, // Rota para Histórico
  
  { path: '**', redirectTo: '' } // Rota curinga para redirecionar para Home em caso de rota inválida
];
