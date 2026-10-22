self.addEventListener('push',e=>{
  const d=e.data?e.data.json():{};
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cl=>{
    if(cl.some(c=>c.visibilityState==='visible'))return;
    return self.registration.showNotification(d.title||'Милки',{body:d.body||'',tag:d.tag,icon:'ava.jpg',data:{url:'./'}});
  }));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cl=>{
    for(const c of cl){if('focus' in c)return c.focus()}
    return clients.openWindow(e.notification.data.url);
  }));
});
