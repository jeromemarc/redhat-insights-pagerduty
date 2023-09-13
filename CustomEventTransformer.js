var event = JSON.parse(PD.inputRequest.rawBody);

var contexts = [{
  "bundle": event.bundle,
  "application": event.application,
  "event_type": event.event_type,
  "org_id": event.org_id,
  "hostname": event.context.hostname,
  "inventory_id": event.context.inventory_id
}];

// Filtering incoming events (optional)
if (event.bundle != "rhel") {
  PD.fail("Event ignored: (" + event.bundle + ") " + event.application + "/" + event.event_type)
}

var application = event.source && event.source.application && event.source.application.display_name ? event.source.application.display_name : event.application;
var event_type = event.source && event.source.event_type && event.source.event_type.display_name ? event.source.event_type.display_name : event.event_type;
var hostname = event.context && event.context.display_name ? event.context.display_name : event.context.hostname;
var client_url = event.context && event.context.host_url ? event.context.host_url : "https://console.redhat.com";

//var normalized_event = [{
//  event_type: PD.Trigger,
//  description: application + "/" + event_type + " on " + hostname,
//  details: event.events,
//  contexts: contexts
//}];

//PD.emitGenericEvents(normalized_event);

// Trigger one alert per recommendation (PagerDuty limits to 40)

var normalized_event = [];

for (var i=1; i<event.events.length+1; i++) {
    var evt = {
      event_type: PD.Trigger,
      description: application + "/" + event_type + " on " + hostname + " (" + i + "/" + event.events.length + ")",
      details: event.events[i-1],
      //incident_key: event.context.inventory_id,
      client: "Red Hat Insights",
      client_url: client_url,
      contexts: contexts
    };
    normalized_event.push(evt);
}

PD.emitGenericEvents(normalized_event);
