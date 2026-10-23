/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║       AI AGENT BUSINESS KIT — Mini CRM                      ║
 * ║       Bootstrap.gs — Container-bound, paste & run           ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * HƯỚNG DẪN SETUP (5 phút):
 * ──────────────────────────
 * Bước 1: Tạo Google Sheet mới tại sheets.google.com
 *         → Đặt tên: "AI Agent Business Kit — CRM"
 * Bước 2: Trong Sheet: Extensions → Apps Script
 *         (Script editor mở, tự động gắn vào Sheet này)
 * Bước 3: Xoá code mặc định → Paste toàn bộ file này → Save
 * Bước 4: Chọn function "setup" → ▶ Run
 *         → Lần đầu: Review permissions → Allow
 *         → Chỉ xin quyền: Google Sheets + External requests
 * Bước 5: Kiểm tra Log: phải thấy "✅ CRM đã sẵn sàng!"
 * Bước 6: Deploy → New deployment → Web App
 *         Execute as: Me | Who has access: Anyone
 *         → Copy Webhook URL → dán vào .env: CRM_WEBHOOK_URL=...
 */

// ═══════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════

var TAB = {
  LEADS:    '📥 Leads',
  CUSTOMERS:'💰 Customers',
  FUNNELS:  '🎯 Funnel Settings',
  DASHBOARD:'📊 Dashboard'
};

var L = { ID:0, TS:1, NAME:2, PHONE:3, FUNNEL:4, TYPE:5, UTM_S:6, UTM_M:7, UTM_C:8, STATUS:9, LAST_CONTACT:10, NOTES:11 };
var C = { ID:0, LEAD_ID:1, TS:2, NAME:3, PHONE:4, PRODUCT:5, AMOUNT:6, ORDER_ID:7, TT_STATUS:8, DELIVERY_STATUS:9, DELIVERY_DATE:10, LTV:11, NOTES:12 };
var F = { SLUG:0, NAME:1, TYPE:2, ZALO_LINK:3, TELEGRAM_LINK:4, DELIVERY_MSG:5, STATUS:6, TELEGRAM_NOTIFY:7 };

// ═══════════════════════════════════════════════════════════════
//  SETUP — Chạy 1 lần để tạo 4 tab
// ═══════════════════════════════════════════════════════════════

function setup() {
  // Container-bound: dùng sheet hiện tại, không cần tạo mới
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  _setupLeadsTab(ss);
  _setupCustomersTab(ss);
  _setupFunnelSettingsTab(ss);
  _setupDashboardTab(ss);

  // Xoá tab mặc định nếu còn
  ['Sheet1','Trang tính1'].forEach(function(n) {
    var s = ss.getSheetByName(n);
    if (s && ss.getSheets().length > 1) ss.deleteSheet(s);
  });

  // Sắp xếp thứ tự tab
  [TAB.LEADS, TAB.CUSTOMERS, TAB.FUNNELS, TAB.DASHBOARD].forEach(function(name, i) {
    var s = ss.getSheetByName(name);
    if (s) { ss.setActiveSheet(s); ss.moveActiveSheet(i + 1); }
  });

  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  ✅  CRM đã sẵn sàng!                    ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  Bước tiếp theo:                         ║');
  console.log('║  Deploy → New deployment → Web App       ║');
  console.log('║  Execute as: Me | Access: Anyone         ║');
  console.log('║  → Copy Webhook URL vào .env             ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
}

// ═══════════════════════════════════════════════════════════════
//  WEBHOOK ENTRY POINTS
// ═══════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    var data   = JSON.parse(e.postData ? e.postData.contents : '{}');
    var action = (data.action || 'lead').toLowerCase();
    if (action === 'order' || action === 'payment' || action === 'purchase') return _handleOrder(data);
    return _handleLead(data);
  } catch(err) {
    return _respond(500, err.message);
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'ping') return _respond(200, 'CRM running ✓ — ' + _now());
  return _respond(200, 'CRM running ✓');
}

// ═══════════════════════════════════════════════════════════════
//  LEAD HANDLER
// ═══════════════════════════════════════════════════════════════

function _handleLead(data) {
  if (!data.phone && !data.name) return _respond(400, 'Missing: phone or name');

  var phone       = (data.phone       || '').trim();
  var name        = (data.name        || '').trim();
  var funnelSlug  = (data.source || data.funnel || '').trim();
  var utmSource   = data.utm_source   || '';
  var utmMedium   = data.utm_medium   || '';
  var utmCampaign = data.utm_campaign || '';

  var funnel   = _getFunnelConfig(funnelSlug);
  var existing = _findLeadByPhone(phone);

  if (existing) {
    _updateLeadOnReoptin(existing.row, funnelSlug);
  } else {
    _writeLead({ phone:phone, name:name,
      funnelSlug:funnelSlug, funnelType:funnel ? funnel.type : 'leads',
      utmSource:utmSource, utmMedium:utmMedium, utmCampaign:utmCampaign });
  }

  if (!funnel || funnel.telegramNotify !== false) {
    _notifyTelegram(_buildLeadMsg(name, phone, funnel ? funnel.displayName : funnelSlug));
  }

  return _respond(200, 'OK');
}

// ═══════════════════════════════════════════════════════════════
//  ORDER HANDLER
// ═══════════════════════════════════════════════════════════════

function _handleOrder(data) {
  if (!data.phone)   return _respond(400, 'Missing: phone');
  if (!data.product) return _respond(400, 'Missing: product');
  if (!data.amount)  return _respond(400, 'Missing: amount');

  var phone   = data.phone.trim();
  var name    = (data.name    || '').trim();
  var product = data.product.trim();
  var amount  = parseFloat(data.amount) || 0;
  var orderId = (data.order_id || data.sepay_id || _genId('ORD')).trim();

  _writeCustomer({ phone:phone, name:name, product:product, amount:amount, orderId:orderId });
  var lead = _findLeadByPhone(phone);
  if (lead) _updateLeadStatus(lead.row, '✅ Converted');
  _notifyTelegram(_buildOrderMsg(name, phone, product, amount, orderId));

  return _respond(200, 'OK');
}

// ═══════════════════════════════════════════════════════════════
//  TAB SETUP — Leads
// ═══════════════════════════════════════════════════════════════

function _setupLeadsTab(ss) {
  var headers = ['ID','Timestamp','Họ tên','Số điện thoại','Funnel','Funnel Type','utm_source','utm_medium','utm_campaign','Trạng thái','Ngày liên hệ cuối','Ghi chú'];
  var sheet   = ss.getSheetByName(TAB.LEADS) || ss.insertSheet(TAB.LEADS);
  if (sheet.getLastRow() <= 1) sheet.clearContents();

  sheet.getRange(1,1,1,headers.length)
    .setValues([headers])
    .setBackground('#141413').setFontColor('#B6FF00').setFontWeight('bold').setFontSize(11);

  sheet.getRange(2, L.STATUS+1, 998)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['🆕 Mới','🔥 Hot','♨️ Warm','❄️ Cold','✅ Converted','❌ Không quan tâm'])
      .setAllowInvalid(false).build());

  [90,160,150,130,160,90,110,100,120,140,140,220].forEach(function(w,i){ sheet.setColumnWidth(i+1,w); });
  sheet.setFrozenRows(1);
  sheet.setTabColor('#34A853');
}

// ═══════════════════════════════════════════════════════════════
//  TAB SETUP — Customers
// ═══════════════════════════════════════════════════════════════

function _setupCustomersTab(ss) {
  var headers = ['ID','Lead ID','Timestamp','Họ tên','Số điện thoại','Sản phẩm','Giá trị (VND)','Mã đơn hàng','Trạng thái TT','Trạng thái giao','Ngày giao','LTV','Ghi chú'];
  var sheet   = ss.getSheetByName(TAB.CUSTOMERS) || ss.insertSheet(TAB.CUSTOMERS);
  if (sheet.getLastRow() <= 1) sheet.clearContents();

  sheet.getRange(1,1,1,headers.length)
    .setValues([headers])
    .setBackground('#141413').setFontColor('#B6FF00').setFontWeight('bold').setFontSize(11);

  sheet.getRange(2, C.TT_STATUS+1, 998)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['⏳ Chờ thanh toán','✅ Đã thanh toán','❌ Thất bại','🔄 Hoàn tiền'])
      .setAllowInvalid(false).build());

  sheet.getRange(2, C.DELIVERY_STATUS+1, 998)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['⏳ Chờ giao','✅ Đã giao','❌ Lỗi giao'])
      .setAllowInvalid(false).build());

  [90,90,160,150,130,180,120,160,150,130,130,120,200].forEach(function(w,i){ sheet.setColumnWidth(i+1,w); });
  sheet.setFrozenRows(1);
  sheet.setTabColor('#FBBC04');
}

// ═══════════════════════════════════════════════════════════════
//  TAB SETUP — Funnel Settings
// ═══════════════════════════════════════════════════════════════

function _setupFunnelSettingsTab(ss) {
  var headers = ['Funnel Slug','Tên hiển thị','Type','Link nhóm Zalo','Link Telegram','Tin nhắn giao tài liệu','Trạng thái','Telegram notify'];
  var sheet   = ss.getSheetByName(TAB.FUNNELS) || ss.insertSheet(TAB.FUNNELS);
  if (sheet.getLastRow() <= 1) sheet.clearContents();

  sheet.getRange(1,1,1,headers.length)
    .setValues([headers])
    .setBackground('#141413').setFontColor('#B6FF00').setFontWeight('bold').setFontSize(11);

  sheet.getRange(2, F.TYPE+1, 98)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['leads','sales','webinar','booking']).setAllowInvalid(false).build());

  sheet.getRange(2, F.STATUS+1, 98)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['🟢 Active','⏸ Paused','📝 Draft']).setAllowInvalid(false).build());

  sheet.getRange(2, F.TELEGRAM_NOTIFY+1, 98)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['TRUE','FALSE']).setAllowInvalid(false).build());

  // Sample row
  sheet.getRange(2,1,1,headers.length).setValues([[
    'ten-funnel-cua-ban', 'Tên Funnel Hiển Thị', 'leads',
    'https://zalo.me/g/XXXXXX',
    'https://t.me/XXXXXX',
    'Tham gia nhóm để nhận tài liệu ngay!',
    '🟢 Active', 'TRUE'
  ]]).setFontColor('#aaaaaa').setFontStyle('italic');

  [180,180,80,220,200,280,100,130].forEach(function(w,i){ sheet.setColumnWidth(i+1,w); });
  sheet.setFrozenRows(1);
  sheet.setTabColor('#4285F4');
}

// ═══════════════════════════════════════════════════════════════
//  TAB SETUP — Dashboard
// ═══════════════════════════════════════════════════════════════

function _setupDashboardTab(ss) {
  var sheet = ss.getSheetByName(TAB.DASHBOARD) || ss.insertSheet(TAB.DASHBOARD);
  sheet.clearContents();

  var dark = '#141413', neon = '#B6FF00';

  sheet.getRange('A1').setValue('📊 Dashboard — AI Agent Business Kit CRM').setFontSize(16).setFontWeight('bold');
  sheet.getRange('A2').setValue('Tự động cập nhật').setFontSize(10).setFontColor('#888888');

  sheet.getRange('A4:E4').setValues([['LEADS','Hôm nay','Tuần này','Tháng này','Tổng']])
    .setFontWeight('bold').setBackground(dark).setFontColor(neon);
  sheet.getRange('A5').setValue('Tất cả leads');
  sheet.getRange('A6').setValue('Chưa converted');
  sheet.getRange('B5').setFormula("=COUNTIFS('📥 Leads'!B:B,\">=\"&TODAY(),'📥 Leads'!B:B,\"<\"&TODAY()+1)");
  sheet.getRange('C5').setFormula("=COUNTIFS('📥 Leads'!B:B,\">=\"&(TODAY()-WEEKDAY(TODAY(),2)+1))");
  sheet.getRange('D5').setFormula("=COUNTIFS('📥 Leads'!B:B,\">=\"&DATE(YEAR(TODAY()),MONTH(TODAY()),1))");
  sheet.getRange('E5').setFormula("=IFERROR(COUNTA('📥 Leads'!B:B)-1,0)");
  sheet.getRange('E6').setFormula("=COUNTIFS('📥 Leads'!J:J,\"<>✅ Converted\",'📥 Leads'!B:B,\"<>Timestamp\",'📥 Leads'!B:B,\"<>\")");

  sheet.getRange('A8:E8').setValues([['REVENUE','Hôm nay','Tuần này','Tháng này','Tổng']])
    .setFontWeight('bold').setBackground(dark).setFontColor(neon);
  sheet.getRange('A9').setValue('Doanh thu');
  sheet.getRange('A10').setValue('Số đơn');
  sheet.getRange('A11').setValue('AOV');
  sheet.getRange('B9').setFormula("=SUMIFS('💰 Customers'!G:G,'💰 Customers'!C:C,\">=\"&TODAY(),'💰 Customers'!I:I,\"✅ Đã thanh toán\")");
  sheet.getRange('D9').setFormula("=SUMIFS('💰 Customers'!G:G,'💰 Customers'!C:C,\">=\"&DATE(YEAR(TODAY()),MONTH(TODAY()),1),'💰 Customers'!I:I,\"✅ Đã thanh toán\")");
  sheet.getRange('E9').setFormula("=SUMIFS('💰 Customers'!G:G,'💰 Customers'!I:I,\"✅ Đã thanh toán\")");
  sheet.getRange('E10').setFormula("=IFERROR(COUNTA('💰 Customers'!C:C)-1,0)");
  sheet.getRange('E11').setFormula("=IFERROR(E9/E10,0)");
  ['B9','D9','E9','E11'].forEach(function(c){ sheet.getRange(c).setNumberFormat('#,##0 "đ"'); });

  sheet.getRange('A13:B13').setValues([['Conversion rate','']])
    .setFontWeight('bold').setBackground(dark).setFontColor(neon);
  sheet.getRange('A14').setValue('Lead → Customer');
  sheet.getRange('B14').setFormula('=IFERROR(E10/E5,0)').setNumberFormat('0.0%');

  sheet.getRange('A16:D16').setValues([['FUNNEL','Leads','Converted','Conv. %']])
    .setFontWeight('bold').setBackground('#f0f0f0');
  for (var i = 0; i < 10; i++) {
    var r = 17 + i;
    sheet.getRange(r,1).setFormula("=IFERROR(INDEX(SORT(UNIQUE(FILTER('📥 Leads'!E:E,'📥 Leads'!E:E<>\"\",'📥 Leads'!E:E<>\"Funnel\")),1,FALSE),"+(i+1)+"),\"\")");
    sheet.getRange(r,2).setFormula("=IF(A"+r+"=\"\",\"\",COUNTIF('📥 Leads'!E:E,A"+r+"))");
    sheet.getRange(r,3).setFormula("=IF(A"+r+"=\"\",\"\",COUNTIFS('📥 Leads'!E:E,A"+r+",'📥 Leads'!J:J,\"✅ Converted\"))");
    sheet.getRange(r,4).setFormula("=IFERROR(C"+r+"/B"+r+",0)").setNumberFormat('0.0%');
  }

  [250,100,100,100,100].forEach(function(w,i){ sheet.setColumnWidth(i+1,w); });
  sheet.setFrozenRows(3);
  sheet.setTabColor('#EA4335');
}

// ═══════════════════════════════════════════════════════════════
//  DATA — Đọc / Ghi
// ═══════════════════════════════════════════════════════════════

function _getSheet(tabName) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tabName);
}

function _writeLead(d) {
  var sheet = _getSheet(TAB.LEADS);
  var id    = 'LEAD-' + String(Math.max(sheet.getLastRow()-1, 0) + 1).padStart(4, '0');
  sheet.appendRow([id, new Date(), d.name||'', d.phone||'', d.funnelSlug||'', d.funnelType||'leads', d.utmSource||'', d.utmMedium||'', d.utmCampaign||'', '🆕 Mới', new Date(), '']);
}

function _writeCustomer(d) {
  var sheet    = _getSheet(TAB.CUSTOMERS);
  var id       = 'CUST-' + String(Math.max(sheet.getLastRow()-1, 0) + 1).padStart(4, '0');
  var lead     = _findLeadByPhone(d.phone);
  var row      = sheet.getLastRow() + 1;
  sheet.appendRow([id, lead?lead.id:'', new Date(), d.name||'', d.phone||'', d.product||'', d.amount||0, d.orderId||'', '⏳ Chờ thanh toán', '⏳ Chờ giao', '', '', '']);
  sheet.getRange(row, C.LTV+1).setFormula('=SUMIF(E:E,E'+row+',G:G)').setNumberFormat('#,##0 "đ"');
}

function _findLeadByPhone(phone) {
  if (!phone) return null;
  var sheet  = _getSheet(TAB.LEADS);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if ((values[i][L.PHONE]||'').toString().trim() === phone.trim()) return { row:i+1, id:values[i][L.ID] };
  }
  return null;
}

function _updateLeadStatus(row, status) {
  var sheet = _getSheet(TAB.LEADS);
  sheet.getRange(row, L.STATUS+1).setValue(status);
  sheet.getRange(row, L.LAST_CONTACT+1).setValue(new Date());
}

function _updateLeadOnReoptin(row, funnelSlug) {
  var sheet   = _getSheet(TAB.LEADS);
  var note    = sheet.getRange(row, L.NOTES+1).getValue() || '';
  var newNote = 'Re-opt-in ' + Utilities.formatDate(new Date(),'Asia/Ho_Chi_Minh','dd/MM/yyyy') + (funnelSlug?' / '+funnelSlug:'');
  sheet.getRange(row, L.LAST_CONTACT+1).setValue(new Date());
  sheet.getRange(row, L.NOTES+1).setValue(note ? note+'\n'+newNote : newNote);
}

function _getFunnelConfig(slug) {
  if (!slug) return null;
  var sheet  = _getSheet(TAB.FUNNELS);
  if (!sheet) return null;
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if ((values[i][F.SLUG]||'').toString().trim() === slug.trim()) {
      return {
        slug:          values[i][F.SLUG],
        displayName:   values[i][F.NAME],
        type:          values[i][F.TYPE],
        zaloLink:      values[i][F.ZALO_LINK],
        telegramLink:  values[i][F.TELEGRAM_LINK],
        deliveryMsg:   values[i][F.DELIVERY_MSG],
        status:        values[i][F.STATUS],
        telegramNotify:values[i][F.TELEGRAM_NOTIFY]===true||values[i][F.TELEGRAM_NOTIFY]==='TRUE'
      };
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
//  TELEGRAM
// ═══════════════════════════════════════════════════════════════

function _notifyTelegram(message) {
  var props  = PropertiesService.getScriptProperties();
  var token  = props.getProperty('TELEGRAM_BOT_TOKEN');
  var chatId = props.getProperty('TELEGRAM_CHAT_ID');
  if (!token || !chatId) return;
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot'+token+'/sendMessage', {
      method:'POST', contentType:'application/json',
      payload: JSON.stringify({ chat_id:chatId, text:message, parse_mode:'Markdown' }),
      muteHttpExceptions: true
    });
  } catch(e) { console.error('Telegram: '+e.message); }
}

function _buildLeadMsg(name, phone, funnelName) {
  return '🆕 *Lead mới!*\n👤 '+(name||'Ẩn danh')+'\n📱 '+phone+'\n🎯 '+(funnelName||'—')+'\n🕐 '+_now();
}

function _buildOrderMsg(name, phone, product, amount, orderId) {
  return '💰 *Đơn hàng mới!*\n👤 '+(name||phone)+'\n📦 '+product+'\n💵 '+Number(amount).toLocaleString('vi-VN')+'đ\n🆔 '+(orderId||'—')+'\n🕐 '+_now();
}

// Gọi thủ công 1 lần để kết nối Telegram
function setupTelegram(botToken, chatId) {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('TELEGRAM_BOT_TOKEN', botToken);
  props.setProperty('TELEGRAM_CHAT_ID', String(chatId));
  _notifyTelegram('✅ *CRM đã kết nối Telegram!*\n🕐 '+_now());
  console.log('✅ Telegram setup xong!');
}

// ═══════════════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════════════

function _respond(code, message) {
  return ContentService
    .createTextOutput(JSON.stringify({status:code, message:message}))
    .setMimeType(ContentService.MimeType.JSON);
}

function _genId(prefix) {
  return prefix+'-'+Utilities.formatDate(new Date(),'Asia/Ho_Chi_Minh','yyyyMMdd')+'-'+Math.floor(Math.random()*9000+1000);
}

function _now() {
  return Utilities.formatDate(new Date(),'Asia/Ho_Chi_Minh','HH:mm dd/MM/yyyy');
}
