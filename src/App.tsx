import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Route, Redirect } from 'react-router-dom'
import { home, book, repeat, statsChart, person } from 'ionicons/icons'

import HomePage from './pages/HomePage'
import LearnPage from './pages/LearnPage'
import ArticlePage from './pages/ArticlePage'
import ReviewPage from './pages/ReviewPage'
import StatsPage from './pages/StatsPage'
import ProfilePage from './pages/ProfilePage'

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/learn" component={LearnPage} />
            <Route exact path="/article/:id" component={ArticlePage} />
            <Route exact path="/review" component={ReviewPage} />
            <Route exact path="/stats" component={StatsPage} />
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>首页</IonLabel>
            </IonTabButton>

            <IonTabButton tab="learn" href="/learn">
              <IonIcon icon={book} />
              <IonLabel>学习</IonLabel>
            </IonTabButton>

            <IonTabButton tab="review" href="/review">
              <IonIcon icon={repeat} />
              <IonLabel>复习</IonLabel>
            </IonTabButton>

            <IonTabButton tab="stats" href="/stats">
              <IonIcon icon={statsChart} />
              <IonLabel>统计</IonLabel>
            </IonTabButton>

            <IonTabButton tab="profile" href="/profile">
              <IonIcon icon={person} />
              <IonLabel>我的</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
