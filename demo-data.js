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

  // Cierres de días anteriores (unos 4 meses, con detalle para el panel por periodo)
  (function(){
    let seed=11; const rnd=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };
    const MENU=[["Empanadas x3",6,14],["Arepa de choclo",6.5,10],["Calentado paisa",11.5,7],["Huevos pericos",7.5,6],["Tamal tolimense",8.5,5],
      ["Patacón con hogao",7,6],["Changua",7,3],["Tinto",1.5,22],["Café con leche",2,14],["Capuchino",2.5,11],["Café de olla",2.8,8],["Lulada",4,9],
      ["Avena helada",3,6],["Chocolate santafereño",5.5,5],["Pandebono",1.8,16],["Almojábana",1.8,10],["Buñuelo",1.5,12],["Obleas",4,4],["Arroz con leche",3.5,4]];
    const WK=[1.4,0.65,0.75,0.8,0.95,1.25,1.6]; // domingo..sábado
    const HR=[4,6,4,3,3,5,7,5,3,3,5,6,4,2,1]; // 8..22 (café de mañana y merienda)
    for(let i=1;i<=125;i++){
      const dt=new Date(now-i*86400000); dt.setHours(21,30,0,0);
      const f=WK[dt.getDay()]*(0.85+rnd()*0.3)*(1+(125-i)*0.0018);
      const top=MENU.map(([n,p,w])=>({name:n,price:p,qty:Math.max(0,Math.round(w*f*(0.7+rnd()*0.6)))}));
      const sales=Math.round(top.reduce((a,x)=>a+x.price*x.qty,0)*100)/100;
      const domShare=0.16+rnd()*0.12, domSales=Math.round(sales*domShare*100)/100;
      const payCount=Math.max(1,Math.round(sales/(11+rnd()*4))), domOrders=Math.round(payCount*domShare*0.7), salaTickets=payCount-domOrders;
      const card=Math.round(sales*(0.48+rnd()*0.08)*100)/100, bizum=Math.round(sales*(0.15+rnd()*0.06)*100)/100, transf=rnd()<0.15?Math.round(sales*0.02*100)/100:0;
      const cash=Math.round((sales-card-bizum-transf)*100)/100;
      const totH=HR.reduce((a,b)=>a+b,0), perH=HR.map(h=>Math.round(h/totH*payCount*(0.6+rnd()*0.8)));
      const r=rnd(), diff=r<0.72?0:r<0.86?-Math.round(rnd()*500)/100:Math.round(rnd()*300)/100;
      store.closings[day(i)]={date:day(i),closedAt:dt.getTime(),orders:payCount,salaTickets,domOrders,cancelled:rnd()<0.2?1:0,sales,salaSales:Math.round((sales-domSales)*100)/100,domSales,
        tips:Math.round(sales*0.02*100)/100,payCount,byMethod:{Efectivo:cash,Tarjeta:card,Bizum:bizum,Transferencia:transf},diff,
        notes:diff<-2?"Faltan "+(-diff).toFixed(2).replace(".",",")+" € en monedas":"",kitchenAvg:Math.round(8+rnd()*6),delivAvg:Math.round(26+rnd()*10),
        perH,top:top.map(({name,qty})=>({name,qty})).sort((a,b)=>b.qty-a.qty)};
    }
  })();

  // Clientes con historial (fichas) y una campaña de ejemplo
  (function(){
    let seed=23; const rnd=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };
    const P={A1:["Empanadas x3",6],A2:["Arepa de choclo",6.5],R1:["Calentado paisa",11.5],R2:["Huevos pericos",7.5],R4:["Tamal tolimense",8.5],A3:["Patacón con hogao",7],
      B3:["Lulada",4],B1:["Café de olla",2.8],B5:["Chocolate santafereño",5.5],A4:["Pandebono",1.8],A6:["Buñuelo",1.5],P1:["Obleas",4]};
    const people=[
      ["Laura Gómez","612345678","C/ de Sants 120, 3º 2ª","Sants",true,["A1","B3"],9,"Sin cebolla en el hogao"],
      ["Andrés Rojas","698765432","Carrer de Muntaner 45, 1º","08011",true,["R4","B1"],6,"El timbre no funciona, llamar"],
      ["Marta Pérez","655111222","Av. Paral·lel 80","Poble-sec",false,["A3","A1"],4,""],
      ["Sofía Martín","633444555","C/ Vilamarí 61, 2º","Sants",true,["B3","A2"],7,""],
      ["Pau Ferrer","644555666","C/ de Blesa 9","Poble-sec",true,["R1","B1"],5,"Le gusta el ají aparte"],
      ["Nuria Vidal","677888999","C/ de Tamarit 150","Sant Antoni",true,["A1"],3,""],
      ["Jordi Puig","600000001","C/ Blai 12","Poble-sec",true,["A1","A4"],8,""],
      ["Camila Torres","611222333","C/ Mallorca 200, 4º 1ª","08036",true,["R1","B3"],11,"Celíaca: avisar en cocina"],
      ["Diego Herrera","622111444","C/ de Girona 30","Eixample",true,["R2","B5"],5,""],
      ["Valentina Ruiz","633222555","Ronda de Sant Antoni 50","Sant Antoni",true,["A2","B3","A6"],6,""],
      ["Óscar Medina","644333666","C/ de Viladomat 88","Sant Antoni",false,["R1"],2,""],
      ["Lucía Blanco","655444777","C/ de Creu Coberta 14","Sants",true,["A4","B1","A6"],12,""],
      ["Santiago López","666555888","Av. de Mistral 22","Sant Antoni",true,["R4"],2,""],
      ["Paula Navarro","677666999","C/ de Calàbria 101","Eixample",true,["P1","B5"],4,""],
      ["Felipe Castro","688777000","C/ del Poeta Cabanyes 7","Poble-sec",true,["R1","A1"],3,""],
      ["Elena Sanz","699888111","C/ de Sepúlveda 60","Sant Antoni",false,["A2"],1,""],
      ["Mateo Rincón","610999222","C/ de Valladolid 5","Sants",true,["A3","B3"],2,""],
      ["Isabel Prieto","621000333","Gran Via 400","Eixample",true,["R2"],1,""]];
    const DAY=86400000;
    store.customers={};
    people.forEach(([name,phone,address,barrio,consent,fav,n,notes],pi)=>{
      const items={}, history=[]; let spent=0;
      const recency = pi===10||pi===13||pi===15 ? 40+pi : pi%5; // algunos llevan tiempo sin pedir
      for(let k=0;k<n;k++){
        const at=now-(recency+k*(4+pi%5)+rnd()*2)*DAY - rnd()*3600000;
        const lines=fav.map(id=>({id,name:P[id][0],price:P[id][1],qty:1+Math.floor(rnd()*2)}));
        if(rnd()<0.3){ const ex=Object.keys(P)[Math.floor(rnd()*12)]; lines.push({id:ex,name:P[ex][0],price:P[ex][1],qty:1}); }
        const total=Math.round((lines.reduce((a,l)=>a+l.price*l.qty,0)+3)*100)/100; spent+=total;
        lines.forEach(l=>{ const x=items[l.id]||{name:l.name,qty:0}; x.qty+=l.qty; items[l.id]=x; });
        if(history.length<15) history.push({at,id:"h"+pi+"_"+k,total,ids:lines.map(l=>l.id),txt:lines.map(l=>l.qty+"× "+l.name).join(", ")});
      }
      history.sort((a,b)=>b.at-a.at);
      store.customers[phone]={name,phone,address,barrio,notes,consent,consentAt:consent?now-90*DAY:null,orders:n,spent:Math.round(spent*100)/100,
        firstAt:history[history.length-1].at,lastAt:history[0].at,items,history,channel:"WhatsApp"};
    });
    // campaña: Calentado paisa en promo, creada hace 2 días
    const cAt=now-2*DAY, rec=Object.keys(store.customers).filter(k=>store.customers[k].consent).slice(0,10);
    const sent={}; rec.slice(0,7).forEach((k,i)=>sent[k]=cAt+(20+i*3)*60000);
    ["611222333","644555666","688777000"].forEach((k,i)=>{ const c=store.customers[k]; const at=cAt+(5+i*9)*3600000;
      c.history.unshift({at,id:"camp"+i,total:Math.round((9.9*(1+i%2)+4+3)*100)/100,ids:["R1","B3"],txt:(1+i%2)+"× Calentado paisa, 1× Lulada"}); c.orders++; c.lastAt=Math.max(c.lastAt,at);
      c.items.R1=c.items.R1||{name:"Calentado paisa",qty:0}; c.items.R1.qty+=1+i%2; });
    store.campaigns={k1:{title:"Calentado paisa a 9,90 €",dishId:"R1",dishName:"Calentado paisa",price:9.9,normalPrice:11.5,audience:"todos",days:30,barrio:"",
      msg:"Hola {nombre} 👋 Hoy en Hecho en mi Pueblo tenemos {plato}{precio}. Pídelo aquí 👉 {link}",createdAt:cAt,until:now+DAY,banner:true,recipients:rec,sent}};
  })();
  store.config.main={tables:10,link:"__DEMO_LINK__",waPhone:"34687703593",deliveryFee:3,promo:{campaignId:"k1",dishId:"R1",title:"Calentado paisa a 9,90 €",price:9.9,until:now+86400000}};

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
