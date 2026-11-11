/* Datos de ejemplo para la demo: viven solo en memoria y se reinician al recargar. */
(function(){
  const now=Date.now(), M=60000, ago=m=>now-m*M;
  const open8=new Date(now); open8.setHours(8,0,0,0); const span=Math.max(now-open8.getTime(), 100*M);
  const hist=m=>Math.round(now-(m/310)*span); // reparte lo ya cobrado entre la apertura y ahora
  const day=d=>{ const x=new Date(now-d*86400000); return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0"); };
  const it=(id,name,price,qty,note)=>({id,name,price,qty,note:note||""});
  const store={orders:{},calls:{},deliveries:{},payments:{},menu:{},closings:{},config:{}};
  const O=(id,o)=>store.orders[id]=Object.assign({paid:false,demo:true},o);

  // En curso ahora
  O("a1",{table:2,station:"cocina",items:[it("R1","Calentado paisa",11.5,2,"Uno sin chicharrón")],status:"preparando",createdAt:ago(12),source:"mesa"});
  O("a2",{table:2,station:"barra",items:[it("B1","Café de olla",2.8,2)],status:"listo",createdAt:ago(12),listoAt:ago(3),source:"mesa"});
  O("a3",{table:5,station:"cocina",items:[it("A1","Empanadas x3",6,1),it("A2","Arepa de choclo",6.5,1,"Extra quesito")],status:"nuevo",createdAt:ago(3),source:"camarero"});
  O("a4",{table:7,station:"barra",items:[it("C3","Capuchino",2.5,1,"Sin lactosa"),it("A4","Pandebono",1.8,2)],status:"entregado",createdAt:ago(30),source:"mesa"});
  O("a5",{table:4,station:"cocina",items:[it("R4","Tamal tolimense",8.5,1)],status:"nuevo",createdAt:ago(17),source:"mesa"});
  O("a6",{table:0,station:"barra",items:[it("C1","Tinto",1.5,2),it("A6","Buñuelo",1.5,2)],status:"preparando",createdAt:ago(4),source:"camarero"});
  store.calls.c1={table:7,type:"cuenta",createdAt:ago(1),done:false,demo:true};
  store.calls.c2={table:3,type:"mesero",createdAt:ago(2),done:false,demo:true};

  // Domicilios en curso
  const D=(id,d,orders)=>{ store.deliveries[id]=Object.assign({paid:false,demo:true,notes:"",fee:3,cashFor:0,prepaid:false,payVerified:false},d);
    orders.forEach((o,i)=>O(id+"o"+i,Object.assign({table:-1,label:"Domicilio · "+d.name.split(" ")[0],delivery:id,createdAt:d.createdAt,source:"domicilio"},o))); };
  D("d1",{name:"Laura Gómez",phone:"612345678",address:"C/ de Sants 120, 3º 2ª",barrio:"Sants",channel:"WhatsApp",pay:"Efectivo",cashFor:20,items:[it("A1","Empanadas x3",6,2)],subtotal:12,total:15,status:"recibido",createdAt:ago(9),log:[{at:ago(9),what:"Pedido recibido por WhatsApp · paga al recibir con Efectivo"}]},
    [{station:"cocina",items:[it("A1","Empanadas x3",6,2)],status:"preparando"}]);
  D("d2",{name:"Andrés Rojas",phone:"698765432",address:"Carrer de Muntaner 45, 1º",barrio:"08011",notes:"El timbre no funciona, llamar",channel:"Instagram",pay:"Bizum",prepaid:true,items:[it("R4","Tamal tolimense",8.5,2)],subtotal:17,total:20,status:"recibido",createdAt:ago(22),log:[{at:ago(22),what:"Pedido recibido por Instagram · pago por adelantado con Bizum"}]},
    [{station:"cocina",items:[it("R4","Tamal tolimense",8.5,2)],status:"listo",listoAt:ago(4)}]);
  D("d3",{name:"Marta Pérez",phone:"655111222",address:"Av. Paral·lel 80",barrio:"Poble-sec",channel:"Teléfono",pay:"Tarjeta (datáfono)",items:[it("A3","Patacón con hogao",7,1)],subtotal:7,total:10,status:"en camino",driver:"Kevin",dispatchedAt:ago(8),createdAt:ago(35),log:[{at:ago(35),what:"Pedido recibido por Teléfono · paga al recibir con Tarjeta (datáfono)"},{at:ago(8),what:"Sale con Kevin"}]},
    [{station:"cocina",items:[it("A3","Patacón con hogao",7,1)],status:"entregado"}]);

  D("d5",{name:"Sofía Martín",phone:"633444555",address:"C/ Vilamarí 61, 2º",barrio:"Sants",channel:"WhatsApp",pay:"Bizum",prepaid:true,payVerified:true,items:[it("B3","Lulada",4,2),it("A2","Arepa de choclo",6.5,1)],subtotal:14.5,total:17.5,status:"recibido",createdAt:ago(18),log:[{at:ago(18),what:"Pedido recibido por WhatsApp · pago por adelantado con Bizum"},{at:ago(16),what:"Pago verificado · Bizum"}]},
    [{station:"barra",items:[it("B3","Lulada",4,2)],status:"listo",listoAt:ago(6)},{station:"cocina",items:[it("A2","Arepa de choclo",6.5,1)],status:"listo",listoAt:ago(5)}]);
  D("d6",{name:"Pau Ferrer",phone:"644555666",address:"C/ de Blesa 9",barrio:"Poble-sec",channel:"Web",pay:"Efectivo",cashFor:50,items:[it("R1","Calentado paisa",11.5,1),it("B1","Café de olla",2.8,1)],subtotal:14.3,total:17.3,status:"recibido",createdAt:ago(14),log:[{at:ago(14),what:"Pedido recibido por Web · paga al recibir con Efectivo"}]},
    [{station:"cocina",items:[it("R1","Calentado paisa",11.5,1)],status:"listo",listoAt:ago(2)},{station:"barra",items:[it("B1","Café de olla",2.8,1)],status:"listo",listoAt:ago(7)}]);
  D("d7",{name:"Nuria Vidal",phone:"677888999",address:"C/ de Tamarit 150",barrio:"Sant Antoni",channel:"Teléfono",pay:"Tarjeta (datáfono)",items:[it("A1","Empanadas x3",6,1)],subtotal:6,total:9,status:"recibido",createdAt:ago(5),log:[{at:ago(5),what:"Pedido recibido por Teléfono · paga al recibir con Tarjeta (datáfono)"}]},
    [{station:"cocina",items:[it("A1","Empanadas x3",6,1)],status:"nuevo"}]);

  // Lo que ya pasó hoy (cobrado)
  const done=[[300,1,"C1","Tinto",1.5,3,"Efectivo"],[285,3,"A4","Pandebono",1.8,4,"Tarjeta"],[250,6,"R1","Calentado paisa",11.5,2,"Tarjeta"],[230,1,"C3","Capuchino",2.5,2,"Bizum"],
    [200,4,"A1","Empanadas x3",6,2,"Efectivo"],[190,8,"B3","Lulada",4,2,"Tarjeta"],[160,2,"R4","Tamal tolimense",8.5,1,"Efectivo"],[130,5,"A2","Arepa de choclo",6.5,3,"Tarjeta"],
    [110,9,"C1","Tinto",1.5,2,"Efectivo"],[90,3,"A1","Empanadas x3",6,1,"Bizum"],[70,6,"B5","Chocolate santafereño",5.5,2,"Tarjeta"],[50,10,"A6","Buñuelo",1.5,5,"Efectivo"]];
  done.forEach(([m,t,id,name,price,qty,method],i)=>{
    O("h"+i,{table:t,station:"cocina",items:[it(id,name,price,qty)],status:"entregado",createdAt:hist(m),listoAt:hist(m)+(7+i%6)*M,paid:true,demo:false});
    store.payments["p"+i]={table:t,kind:"sala",total:Math.round(price*qty*100)/100,tip:0,method,createdAt:Math.min(now,hist(m)+25*M)};
  });
  store.deliveries.d4={name:"Jordi Puig",phone:"600000001",address:"C/ Blai 12",barrio:"Poble-sec",channel:"WhatsApp",pay:"Bizum",prepaid:true,payVerified:true,items:[it("A1","Empanadas x3",6,1)],subtotal:6,fee:3,total:9,status:"entregado",driver:"Kevin",createdAt:hist(140),dispatchedAt:hist(140)+20*M,deliveredAt:hist(140)+32*M,paid:true,
    log:[{at:hist(140),what:"Pedido recibido por WhatsApp · pago por adelantado con Bizum"},{at:hist(140)+4*M,what:"Pago verificado · Bizum"},{at:hist(140)+20*M,what:"Sale con Kevin"},{at:hist(140)+32*M,what:"Entregado (pagado por adelantado · Bizum)"}]};
  store.payments.pd={table:-1,label:"Domicilio · Jordi Puig",kind:"domicilio",prepaid:true,total:9,tip:0,method:"Bizum",createdAt:hist(140)+32*M};

  // Cierres de días anteriores
  store.closings[day(1)]={date:day(1),closedAt:now-86400000,orders:41,sales:612.4,byMethod:{Efectivo:180.5,Tarjeta:301.9,Bizum:130,Transferencia:0},diff:0};
  store.closings[day(2)]={date:day(2),closedAt:now-2*86400000,orders:37,sales:548.1,byMethod:{Efectivo:150,Tarjeta:298.1,Bizum:100,Transferencia:0},diff:-3.2,notes:"Faltan 3,20 € en monedas"};
  store.closings[day(3)]={date:day(3),closedAt:now-3*86400000,orders:45,sales:689.75,byMethod:{Efectivo:210,Tarjeta:349.75,Bizum:130,Transferencia:0},diff:1.5,notes:"Sobra 1,50 €"};

  store.config.main={tables:10,link:"__DEMO_LINK__",waPhone:"34687703593",deliveryFee:3};

  // Base de datos en memoria con la misma forma que la real
  const subs=[], fire=()=>subs.slice().forEach(s=>s());
  const snap=(id,d)=>({id,exists:!!d,data:()=>d,metadata:{fromCache:false,hasPendingWrites:false}});
  const newId=()=>"n"+Math.random().toString(36).slice(2,9);
  function q(col,f,ord,lim){ return {
    where:(a,op,v)=>q(col,f.concat([[a,op,v]]),ord,lim), orderBy:(a,dir)=>q(col,f,[a,dir||"asc"],lim), limit:n=>q(col,f,ord,n),
    onSnapshot(next){ const run=()=>{ let docs=Object.entries(store[col]||{}).filter(([,d])=>f.every(([a,op,v])=>op==="=="?d[a]===v:op===">="?d[a]>=v:true));
        if(ord) docs.sort((x,y)=>(x[1][ord[0]]>y[1][ord[0]]?1:-1)*(ord[1]==="desc"?-1:1)); if(lim) docs=docs.slice(0,lim);
        const ds=docs.map(([id,d])=>snap(id,d)); next({docs:ds,size:ds.length,empty:!ds.length,docChanges:()=>[],metadata:{fromCache:false,hasPendingWrites:false}}); };
      subs.push(run); setTimeout(run,0); return ()=>{ const i=subs.indexOf(run); if(i>-1) subs.splice(i,1); }; },
    add(d){ (store[col]=store[col]||{})[newId()]=JSON.parse(JSON.stringify(d)); fire(); return Promise.resolve(); },
    doc(id){ return ref(col,id||newId()); } }; }
  function ref(col,id){ return { id,
    get:()=>Promise.resolve(snap(id,(store[col]||{})[id])),
    set(d){ (store[col]=store[col]||{})[id]=JSON.parse(JSON.stringify(d)); fire(); return Promise.resolve(); },
    update(d){ if(!store[col]||!store[col][id]) return Promise.reject({code:"invalid_argument"}); Object.assign(store[col][id],JSON.parse(JSON.stringify(d))); fire(); return Promise.resolve(); },
    delete(){ if(store[col]) delete store[col][id]; fire(); return Promise.resolve(); },
    onSnapshot(next){ const run=()=>next(snap(id,(store[col]||{})[id])); subs.push(run); setTimeout(run,0); return ()=>{ const i=subs.indexOf(run); if(i>-1) subs.splice(i,1); }; } }; }
  window.__DEMO_DB={ collection:c=>q(c,[]), doc:p=>{ const [c,i]=p.split("/"); return ref(c,i); } };
})();
