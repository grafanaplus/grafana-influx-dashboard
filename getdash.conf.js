// Configuration JS file for getdash.app.js

// getDashConf :: -> configurationObj
var getDashConf = function getDashConf () {
  'use strict';

  var pluginConfProto = {
    alias: undefined,                // Used to replace real measurement name in graphs.

    separator: ',',                  // Used to define series separator.

    //merge: [ 'instance' ],         // Used to merge multiple instances, types or descriptions
                                     // to one line.

    //multi: false,                  // Used to split single measurement instances to multiple
                                     // individual graphs.

    //regexp: /\d$/,                 // Used to filter instances by regexp.

    //datasources: [ 'graphite' ],   // Used to limit datasources per plugin.
                                     // If undefined all grafana InfluxDB
                                     // datasources will be used.

    tags: {                          // Used to identify data in InfluxDB.
      host: 'host',                  // Defaults are set to work with CollectD metric collector.
      instance: 'instance',
      description: 'type_instance',
      type: 'type'
    }
  };

  // Plugin constructor
  function Plugin (config) {
    Object.defineProperty(this, 'config', {
      value: _.merge({}, pluginConfProto, config),
      enumerable: false
    });
  }

  // collectd plugins configuration
  var plugins = {};
  Object.defineProperty(plugins, 'groups', {
    value: {},
    enumerable: false
  });

  // plugin groups configuration
  plugins.groups.system = [
    'cpu',
    'memory',
    'load',
    'swap',
    'interface',
    'netlink',
    'ping',
    'connstate',
    'tcpconns',
    'conntrack',
    'df',
    'lvm',
    'disk',
    'hddtemp',
    'processes',
    'entropy',
    'users',
    'uptime',
    'irq',
    'nfs',
    'ipvs',
    'docker'
  ];
  plugins.groups.middleware = [
    'redis',
    'memcache',
    'rabbitmq',
    'elasticsearch',
    'nginx',
    'zookeeper',
    'mesos',
    'apache',
    'kafka'
  ];
  plugins.groups.database = [
    'elasticsearch',
    'mysql',
    'postgresql'
  ];


  // collectd cpu plugin configuration: https://github.com/anryko/cpu-collectd-plugin
  // works also with default cpu collectd plugin configured as below
  // for reporting aggregated on collectd level metrics:
  // <Plugin cpu>
  //   ReportByState true
  //   ReportByCPU false
  // </Plugin>
  // for reporting per-CPU (per-core) metrics that will be aggregated on Grafana level:
  // <Plugin cpu>
  //   ReportByState true
  //   ReportByCPU true
  //   ValuesPercentage true
  // </Plugin>
  plugins.cpu = new Plugin({ 'alias': 'cpu' });
  plugins.cpu.config.merge = [ 'instance' ];

  plugins.cpu.cpu = {
    'graph': {
      'system': {
        'color': '#EAB839',
        'alias': '@description'
      },
      'user': {
        'color': '#508642',
        'alias': '@description'
      },
      'idle': {
        'color': '#303030',
        'alias': '@description'
      },
      'wait': {
        'color': '#890F02',
        'alias': '@description'
      },
      'steal': {
        'color': '#E24D42',
        'alias': '@description'
      },
      'nice': {
        'color': '#9400D3',
        'alias': '@description'
      },
      'softirq': {
        'color': '#E9967A',
        'alias': '@description'
      },
      'interrupt': {
        'color': '#1E90FF',
        'alias': '@description'
      }
    },
    'panel': {
      'title': 'CPU',
      'yaxes': [ { 'format': 'percent', 'max': 100 }, {} ],
      'fill': 7,
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'percentage': true
    }
  };


  // collectd memory plugin configuration
  plugins.memory = new Plugin();

  plugins.memory.memory = {
    'graph': {
      'used': {
        'color': '#1F78C1',
        'alias': '@description'
      },
      'cached': {
        'color': '#EF843C',
        'alias': '@description'
      },
      'buffered': {
        'color': '#CCA300',
        'alias': '@description'
      },
      'free': {
        'color': '#629E51',
        'alias': '@description'
      }
    },
    'panel': {
      'title': 'Memory',
      'yaxes': [ { 'format': 'bytes' }, {} ],
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };


  // collectd load plugin configuration
  plugins.load = new Plugin();

  plugins.load.midterm = {
    'graph': {
      'load_shortterm': {
         'color': '#508642',
         'alias': '1m@'
       },
      'load_midterm': {
         'color': '#447EBC',
         'alias': '5m@'
       },
      'load_longterm': {
         'color': '#C15C17',
         'alias': '15m@'
       }
    },
    'panel': {
      'title': 'Load Average'
    }
  };


  // collectd swap plugin configuration
  plugins.swap = new Plugin();

  plugins.swap.swap = {
    'graph': {
      'used': {
        'color': '#1F78C1',
        'alias': 'used'
      },
      'cached': {
        'color': '#EAB839',
        'alias': 'cached'
      },
      'free': {
        'color': '#508642',
        'alias': 'free'
      }
    },
    'panel': {
      'title': 'Swap',
      'yaxes': [ { 'format': 'bytes' }, {} ],
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };

  plugins.swap.swapIO = {
    'graph': {
      'in': {
        'color': '#447EBC',
        'apply': 'derivative'
      },
      'out': {
        'color': '#508642',
        'apply': 'derivative',
        'math': '* -1'
      }
    },
    'panel': {
      'title': 'Swap IO',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };


  // collectd interface plugin configuration
  plugins.interface = new Plugin();
  plugins.interface.config.multi = true;

  plugins.interface.traffic = {
    'graph': {
      'rx': {
        'color': '#447EBC',
        'alias': 'octets-rx',
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_octets'
      },
      'tx': {
        'color': '#508642',
        'alias': 'octets-tx',
        'apply': 'derivative',
        'type': 'if_octets'
      }
    },
    'panel': {
      'title': 'Network Traffic on @metric',
      'yaxes': [ { 'format': 'Bps' }, {} ],
      'grid': { 'max': null, 'min': null, 'leftMin': null }
    }
  };

  plugins.interface.packets = {
    'graph': {
      'rx': {
        'color': '#447EBC',
        'alias': 'packets-rx',
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_packets'
      },
      'tx': {
        'color': '#508642',
        'alias': 'packets-tx',
        'apply': 'derivative',
        'type': 'if_packets'
      }
    },
    'panel': {
      'title': 'Network Packets on @metric',
      'yaxes': [ { 'format': 'pps' }, {} ],
      'grid': { 'max': null, 'min': null, 'leftMin': null }
    }
  };


  // collectd netlink plugin configuration
  plugins.netlink = new Plugin({ 'alias': 'netlink' });
  plugins.netlink.config.multi = true;

  plugins.netlink.packets = {
    'graph': {
      'rx': {
        'color': '#447EBC',
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_packets',
        'alias': '@instance.rx'
      },
      'tx': {
        'color': '#508642',
        'apply': 'derivative',
        'type': 'if_packets',
        'alias': '@instance.tx'
      }
    },
    'panel': {
      'title': 'Netlink packets for @metric',
      'yaxes': [ { 'format': 'pps' }, {} ],
      'grid': { 'max': null, 'min': null, 'leftMin': null }
    }
  };

  plugins.netlink.octets = {
    'graph': {
      'rx': {
        'color': '#447EBC',
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_octets',
        'alias': '@instance.rx'
      },
      'tx': {
        'color': '#508642',
        'apply': 'derivative',
        'type': 'if_octets',
        'alias': '@instance.tx'
      }
    },
    'panel': {
      'title': 'Netlink octets for @metric',
      'yaxes': [ { 'format': 'bps' }, {} ],
      'grid': { 'max': null, 'min': null, 'leftMin': null }
    }
  };

  plugins.netlink.problems = {
    'graph': {
      'rx': {
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_errors',
        'alias': '@instance.error.rx'
      },
      'tx': {
        'apply': 'derivative',
        'type': 'if_errors',
        'alias': '@instance.error.tx'
      },
      '_rx': {
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_dropped',
        'alias': '@instance.drop.rx'
      },
      '_tx': {
        'apply': 'derivative',
        'type': 'if_dropped',
        'alias': '@instance.drop.tx'
      },
      'netlink_value': {
        'apply': 'derivative',
        'type': 'if_collisions',
        'alias': '@instance.collision'
      }
    },
    'panel': {
      'title': 'Netlink problems for @metric',
      'yaxes': [ { 'format': 'pps' }, {} ],
      'grid': { 'max': null, 'min': null, 'leftMin': null }
    }
  };

  plugins.netlink.errorsExtended = {
    'graph': {
      'crc': {
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_rx_errors',
        'alias': '@instance.crc-rx'
      },
      'fifo': {
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_rx_errors',
        'alias': '@instance.fifo-rx'
      },
      'frame': {
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_rx_errors',
        'alias': '@instance.frame-rx'
      },
      'length': {
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_rx_errors',
        'alias': '@instance.length-rx'
      },
      'missed': {
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_rx_errors',
        'alias': '@instance.missed-rx'
      },
      'over': {
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_rx_errors',
        'alias': '@instance.over-rx'
      },
      'fifo': {
        'apply': 'derivative',
        'type': 'if_tx_errors',
        'alias': '@instance.fifo-tx'
      },
      'aborted': {
        'apply': 'derivative',
        'type': 'if_tx_errors',
        'alias': '@instance.aborted-tx'
      },
      'carrier': {
        'apply': 'derivative',
        'type': 'if_tx_errors',
        'alias': '@instance.carrier-tx'
      },
      'heartbeat': {
        'apply': 'derivative',
        'type': 'if_tx_errors',
        'alias': '@instance.heartbeat-tx'
      },
      'window': {
        'apply': 'derivative',
        'type': 'if_tx_errors',
        'alias': '@instance.window-tx'
      }
    },
    'panel': {
      'title': 'Netlink errors for @metric',
      'yaxes': [ { 'format': 'pps' }, {} ],
      'grid': { 'max': null, 'min': null, 'leftMin': null }
    }
  };

  plugins.netlink.multicast = {
    'graph': {
      'netlink_value': {
        'color': '#FFCC00',
        'apply': 'derivative',
        'type': 'if_multicast',
        'alias': '@instance.multicast'
      }
    },
    'panel': {
      'title': 'Netlink multicast for @metric',
      'yaxes': [ { 'format': 'pps' }, {} ]
    }
  };


  // collectd ipvs plugin configuration
  plugins.ipvs = new Plugin({ 'alias': 'ipvs'});

  plugins.ipvs.ipvs = {
    'graph': {
      'ipvs_value': {
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Loadbalanced connections',
      'yaxes': [ { 'format': 'pps' }, {} ]
    }
  };

  // collectd ping plugin configuration
  plugins.ping = new Plugin();

  plugins.ping.ping = {
    'graph': {
      'ping_value': { 'color': '#1F78C1' }
    },
    'panel': {
      'title': 'Ping',
      'yaxes': [ { 'format': 'ms' }, {} ]
    }
  };


  // collectd nfs plugin configuration
  plugins.nfs = new Plugin({ 'alias': 'nfs' });

  plugins.nfs.nfs = {
    'graph': {
      '/.*/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'NFS for @metric',
      'yaxes': [ { 'format': 'pps' }, {} ]
    }
  };


  // collectd connstate plugin configuration: https://github.com/anryko/connstate-collectd-plugin
  plugins.connstate = new Plugin({ 'alias': 'connstate' });
  plugins.connstate.config.merge = [ 'instance' ];

  plugins.connstate.connStates = {
    'graph': {
      'established': {
        'color': '#FCE94F',
        'apply': 'sum',
        'alias': 'established@'
      },
      'syn_sent': {
        'color': '#FCAF3E',
        'apply': 'sum',
        'alias': 'syn_sent@'
      },
      'syn_recv': {
        'color': '#8AE234',
        'apply': 'sum',
        'alias': 'syn_recv@'
      },
      'fin_wait1': {
        'color': '#729FCF',
        'apply': 'sum',
        'alias': 'fin_wait1@'
      },
      'fin_wait2': {
        'color': '#AD7FA8',
        'apply': 'sum',
        'alias': 'fin_wait2@'
      },
      'time_wait': {
        'color': '#EF2929',
        'apply': 'sum',
        'alias': 'time_wait@'
      },
      '/close$/': {
        'color': '#D3D7CF',
        'apply': 'sum',
        'alias': 'close@'
      },
      'close_wait': {
        'color': '#2E3436',
        'apply': 'sum',
        'alias': 'close_wait@'
      },
      'last_ack': {
        'color': '#4E9A06',
        'apply': 'sum',
        'alias': 'last_ack@'
      },
      'listen': {
        'color': '#CE5C00',
        'apply': 'sum',
        'alias': 'listen@'
      },
      'closing': {
        'color': '#C4A000',
        'apply': 'sum',
        'alias': 'closing@'
      }
    },
    'panel': {
      'title': 'Network Connections States',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };


  // collectd tcpconns plugin configuration
  plugins.tcpconns = new Plugin({ 'alias': 'tcpconns' });
  plugins.tcpconns.config.multi = true;

  plugins.tcpconns.tcpconnss = {
    'graph': {
      'ESTABLISHED': {
        'color': '#FCE94F',
        'alias': 'ESTABLISHED'
      },
      'SYN_SENT': {
        'color': '#FCAF3E',
        'alias': 'SYN_SENT'
      },
      'SYN_RECV': {
        'color': '#8AE234',
        'alias': 'SYN_RECV'
      },
      'FIN_WAIT1': {
        'color': '#729FCF',
        'alias': 'FIN_WAIT1'
      },
      'FIN_WAIT2': {
        'color': '#AD7FA8',
        'alias': 'FIN_WAIT2'
      },
      'TIME_WAIT': {
        'color': '#EF2929',
        'alias': 'TIME_WAIT'
      },
      'CLOSED': {
        'color': '#D3D7CF',
        'alias': 'CLOSED'
      },
      'CLOSE_WAIT': {
        'color': '#2E3436',
        'alias': 'CLOSE_WAIT'
      },
      'LAST_ACK': {
        'color': '#4E9A06',
        'alias': 'LAST_ACK'
      },
      'LISTEN': {
        'color': '#CE5C00',
        'alias': 'LISTEN'
      },
      'CLOSING': {
        'color': '#C4A000',
        'alias': 'CLOSING'
      }
    },
    'panel': {
      'title': 'Network Connections States for TCP/@metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };


  // collectd conntrack plugin configuration
  // collectd conntrack plugin returns measurements like this:
  //   conntrack_value,host=host.example.com,type=conntrack
  //   conntrack_value,host=host.example.com,type=conntrack,type_instance=max
  //   conntrack_value,host=host.example.com,type=percent,type_instance=used
  // so tag 'type_instance' has an empty value. To set proper value we'll
  // use collectd chains https://collectd.org/wiki/index.php/Chains
  //   LoadPlugin match_regex
  //   LoadPlugin target_replace
  //
  //   <Chain "PreCache">
  //     <Rule "conntrack_add_instance_type" >
  //       <Match "regex">
  //         Plugin "^conntrack$"
  //       </Match>
  //       <Target "replace">
  //         TypeInstance "^$" "used"
  //       </Target>
  //       Target "return"
  //     </Rule>
  //     Target "return"
  //   </Chain>
  plugins.conntrack = new Plugin();

  plugins.conntrack.conntrack = {
    'graph': {
      'used': {
        'color': '#00FF99',
        'type': 'conntrack',
      }
    },
    'panel': {
      'title': 'Network Connections Tracking Count',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.conntrack.percent = {
    'graph': {
      'used': {
        'color': '#00FF99',
        'type': 'percent',
       }
    },
    'panel': {
      'title': 'Network Connections Tracking Table Usage',
      'yaxes': [ { 'format': 'percent' }, {} ]
    }
  };


  // collectd df plugin configuration
  plugins.df = new Plugin({ 'alias': 'df' });
  plugins.df.config.multi = true;

  plugins.df.space = {
    'graph': {
      'used': {
        'color': '#447EBC',
        'type': 'df_complex'
      },
      'reserved': {
        'color': '#EAB839',
        'type': 'df_complex'
      },
      'free': {
        'color': '#508642',
        'type': 'df_complex'
      }
    },
    'panel': {
      'title': 'Disk space for @metric',
      'yaxes': [ { 'format': 'bytes' }, {} ],
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };

  plugins.df.inode = {
    'graph': {
      'used': {
        'color': '#447EBC',
        'type': 'df_inodes'
      },
      'reserved': {
        'color': '#EAB839',
        'type': 'df_inodes'
      },
      'free': {
        'color': '#508642',
        'type': 'df_inodes'
      }
    },
    'panel': {
      'title': 'Disk inodes for @metric',
      'yaxes': [ { 'format': 'short' }, {} ],
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };


  // collectd lvm plugin configuration
  plugins.lvm = new Plugin();
  plugins.lvm.config.multi = true;

  plugins.lvm.space = {
    'graph': { '': { } },
    'panel': {
      'title': 'Disk space for @metric',
      'yaxes': [ { 'format': 'bytes' }, {} ],
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };


  // collectd disk plugin configuration
  plugins.disk = new Plugin();
  plugins.disk.config.multi = true;
  plugins.disk.config.regexp = /\d$/;

  plugins.disk.diskOps = {
    'graph': {
      'read': {
        'color': '#447EBC',
        'apply': 'derivative',
        'type': 'disk_ops'
      },
      'write': {
        'color': '#508642',
        'math': '* -1',
        'apply': 'derivative',
        'type': 'disk_ops'
      }
    },
    'panel': {
      'title': 'Disk Operations for @metric',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'yaxes': [ { 'format': 'iops' }, {} ]
    }
  };

  plugins.disk.diskOctets = {
    'graph': {
      'read': {
        'color': '#447EBC',
        'apply': 'derivative',
        'type': 'disk_octets'
      },
      'write': {
        'color': '#508642',
        'math': '* -1',
        'apply': 'derivative',
        'type': 'disk_octets'
      }
    },
    'panel': {
      'title': 'Disk Traffic for @metric',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.disk.diskTime = {
    'graph': {
      'read': {
        'color': '#447EBC',
        'apply': 'derivative',
        'type': 'disk_time'
      },
      'write': {
        'color': '#508642',
        'math': '* -1',
        'apply': 'derivative',
        'type': 'disk_time'
      }
    },
    'panel': {
      'title': 'Disk Wait for @metric',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'yaxes': [ { 'format': 'ms' }, {} ]
    }
  };


  // collectd hddtemp plugin configuration
  plugins.hddtemp = new Plugin();

  plugins.hddtemp.temperature = {
    'graph': {
       '': { }
     },
    'panel': {
      'title': 'Disk Temperature',
      'yaxes': [ { 'format': 'celsius' }, {} ]
    }
  };


  // collectd processes plugin configuration
  plugins.processes = new Plugin({ 'alias': 'processes' });

  plugins.processes.state = {
    'graph': {
      'sleeping': {
        'type': 'ps_state',
        'color': '#EAB839',
        'alias': 'sleeping'
      },
      'running': {
        'type': 'ps_state',
        'color': '#508642',
        'alias': 'running'
      },
      'stopped': {
        'type': 'ps_state',
        'color': '#E9967A',
        'alias': 'stopped'
      },
      'blocked': {
        'type': 'ps_state',
        'color': '#890F02',
        'alias': 'blocked'
      },
      'zombies': {
        'type': 'ps_state',
        'color': '#E24D42',
        'alias': 'zombies'
      },
      'paging': {
        'type': 'ps_state',
        'color': '#9400D3',
        'alias': 'paging'
      }
    },
    'panel': {
      'title': 'Processes State',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.processes.fork = {
    'graph': {
      'processes': {
        'color': '#BA43A9',
        'alias': 'forks',
        'apply': 'derivative',
        'type': 'fork_rate'
      }
    },
    'panel': {
      'title': 'Processes Fork Rate',
      'yaxes': [ { 'format': 'pps' }, {} ]
    }
  };

  plugins.processes.psVM = {
    'graph': {
      'processes': {
        'type': 'ps_vm',
        'alias': 'vm'
      }
    },
    'panel': {
      'title': 'Processes VM',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.processes.psStackSize = {
    'graph': {
      'processes': {
        'type': 'ps_stacksize',
        'alias': 'stacksize'
      }
    },
    'panel': {
      'title': 'Processes Stack Size',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.processes.psRSS = {
    'graph': {
      'processes': {
        'type': 'ps_rss',
        'alias': 'rss'
      }
    },
    'panel': {
      'title': 'Processes RSS',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };


  // collectd processes plugin configuration with individual metrics
  plugins.process = new Plugin({ 'alias': 'process' });
  plugins.process.config.multi = true;

  plugins.process.psCount = {
    'graph': {
      'threads': {
        'color': '#508642',
        'type': 'ps_count',
        'alias': 'threads'
      },
      '_processes': {
        'color': '#EAB839',
        'type': 'ps_count',
        'alias': 'processes'
      }
    },
    'panel': {
      'title': 'Processes/Threads Count for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.process.psCpuTime = {
    'graph': {
      'syst': {
        'color': '#EAB839', 
        'type': 'ps_cputime',
        'apply': 'derivative',
        'alias': 'cpu-system'
      },
      'user': {
        'color': '#508642',
        'type': 'ps_cputime',
        'apply': 'derivative',
        'alias': 'cpu-user'
      }
    },
    'panel': {
      'title': 'Process CPU Time for @metric',
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'yaxes': [ { 'format': 'µs' }, {} ]
    }
  };

  plugins.process.psPageFaults = {
    'graph': {
      'majflt': {
        'color': '#890F02',
        'type': 'ps_pagefaults',
        'apply': 'derivative',
        'alias': 'faults-major'
      },
      'minflt': {
        'color': '#C15C17',
        'type': 'ps_pagefaults',
        'apply': 'derivative',
        'alias': 'faults-minor'
      }
    },
    'panel': {
      'title': 'Process Page Faults for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.process.psDiskOps = {
    'graph': {
      'read': {
        'color': '#447EBC',
        'type': 'ps_disk_ops',
        'apply': 'derivative',
        'alias': 'ops-read'
      },
      'write': {
        'color': '#508642',
        'type': 'ps_disk_ops',
        'math': '* -1',
        'apply': 'derivative',
        'alias': 'ops-write'
      }
    },
    'panel': {
      'title': 'Process Disk Ops for @metric',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'yaxes': [ { 'format': 'iops' }, {} ]
    }
  };

  plugins.process.psDiskOctets = {
    'graph': {
      'read': {
        'color': '#447EBC',
        'type': 'ps_disk_octets',
        'apply': 'derivative',
        'alias': 'bytes-read'
      },
      'write': {
        'color': '#508642',
        'type': 'ps_disk_octets',
        'math': '* -1',
        'apply': 'derivative',
        'alias': 'bytes-write'
      }
    },
    'panel': {
      'title': 'Process Disk Octets for @metric',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'yaxes': [ { 'format': 'bps' }, {} ]
    }
  };

  plugins.process.psCodeData = {
    'graph': {
      'processes': {
        'color': '#EAB839',
        'type': 'ps_code',
        'alias': 'size-code'
      },
      'value': {
        'color': '#508642',
        'type': 'ps_data',
        'alias': 'size-data'
      }
    },
    'panel': {
      'title': 'Process Code and Data for @metric',
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.process.psVM = {
    'graph': {
      'processes': {
        'type': 'ps_vm',
        'alias': 'vm'
      }
    },
    'panel': {
      'title': 'Process VM for @metric',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.process.psStackSize = {
    'graph': {
      'processes': {
        'type': 'ps_stacksize',
        'alias': 'stacksize'
      }
    },
    'panel': {
      'title': 'Process Stack Size for @metric',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.process.psRSS = {
    'graph': {
      'processes': {
        'type': 'ps_rss',
        'alias': 'rss'
      }
    },
    'panel': {
      'title': 'Process RSS for @metric',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };


  // collectd entropy plugin configuration
  plugins.entropy = new Plugin();

  plugins.entropy.entropy = {
    'graph': {
      'entropy': { 'color': '#1F78C1' }
    },
    'panel': {
      'title': 'Entropy',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };


  // collectd users plugin configuration
  plugins.users = new Plugin();

  plugins.users.users = {
    'graph': {
      'users': {
        'color': '#CCFF66',
        'alias': 'count',
        'apply': 'max'
      }
    },
    'panel': {
      'title': 'Users'
    }
  };


  // collectd uptime plugin configuration
  plugins.uptime = new Plugin();

  plugins.uptime.uptime = {
    'graph': {
      'uptime': { 'color': '#00FF99' }
    },
    'panel': {
      'title': 'System Uptime',
      'y_formats': [ 's' ]
    }
  };


  // collectd redis plugin configuration: https://github.com/powdahound/redis-collectd-plugin
  plugins.redis = new Plugin({ 'alias': 'redis' });

  plugins.redis.cpu = {
    'graph': {
      'used_cpu_sys_children': {
        'color': '#F2D488',
        'apply': 'derivative',
        'alias': '@instance.cpu-system-children'
      },
      'used_cpu_user_children': {
        'color': '#96B68D',
        'apply': 'derivative',
        'alias': '@instance.cpu-user-children'
      },
      '/^used_cpu_sys$/': {
        'color': '#EAB839',
        'apply': 'derivative',
        'alias': '@instance.cpu-system'
      },
      '/^used_cpu_user$/': {
        'color': '#508642',
        'apply': 'derivative',
        'alias': '@instance.cpu-user'
      }
    },
    'panel': {
      'title': 'Redis CPU Time',
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'y_formats': [ 's' ]
    }
  };

  plugins.redis.memory = {
    'graph': {
      'used_memory_rss': {
        'color': '#EAB839',
        'alias': '@instance.memory-used-rss'
      },
      'used_memory_peak': {
        'color': '#447EBC',
        'alias': '@instance.memory-used-peak'
      },
      '/^used_memory$/': {
        'color': '#508642',
        'alias': '@instance.memory-used'
      }
    },
    'panel': {
      'title': 'Redis Memomy',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.redis.uptime = {
    'graph': {
      'uptime_in_seconds': {
        'color': '#00FF99'
      }
    },
    'panel': {
      'title': 'Redis Uptime',
      'y_formats': [ 's' ]
    }
  };

  plugins.redis.commandsOps = {
    'graph': {
      'instantaneous_ops_per_sec': {
        'color': '#6600FF',
        'alias': '@instance.ops'
      },
      'commands_processed': {
        'color': '#FF6600',
        'apply': 'derivative',
        'alias': '@instance.commands'
      }
    },
    'panel': {
      'title': 'Redis Commands',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.redis.connections = {
    'graph': {
      'connections_received': {
        'color': '#447EBC',
        'apply': 'derivative',
        'alias': '@instance.connections-received'
      },
      'rejected_connections': {
        'color': '#FF6600',
        'apply': 'derivative',
        'alias': '@instance.connections-rejected'
      },
      'connected_clients': {
        'color': '#508642',
        'apply': 'derivative',
        'alias': '@instance.clients-connected'
      },
      'blocked_clients': {
        'color': '#E24D42',
        'apply': 'derivative',
        'alias': '@instance.clients-blocked'
      }
    },
    'panel': {
      'title': 'Redis Connections',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.redis.unsaved = {
    'graph': {
      'changes_since_last_save': {
        'color': '#E24D42',
        'alias': '@instance.changes-unsaved'
      }
    },
    'panel': {
      'title': 'Redis Unsaved Changes',
      'yaxes': [ { 'format': 'short' }, {} ],
      'fill': 2
    }
  };

  plugins.redis.slaves = {
    'graph': {
      'connected_slaves': {
        'color': '#508642',
        'alias': '@instance.slaves'
      }
    },
    'panel': {
      'title': 'Redis Connected Slaves',
      'fill': 2
    }
  };

  plugins.redis.hitstMisses = {
    'graph': {
      'keyspace_hits': {
        'color': '#00FF66',
        'apply': 'derivative',
        'alias': '@instance.key-hits'
      },
      'keyspace_misses': {
        'color': '#FF6600',
        'apply': 'derivative',
        'alias': '@instance.key-misses'
      }
    },
    'panel': {
      'title': 'Redis DB Keyspace',
      'yaxes': [ { 'format': 'percent' }, {} ]
    }
  };

  plugins.redis.keys = {
    'graph': {
      '/keys$/': {
        'alias': '@instance.@description'
      }
    },
    'panel': {
      'title': 'Redis DB Keys',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.redis.repl = {
    'graph': {
      'master_repl_offset': {
        'color': '#508642',
        'alias': '@instance.master-repl-offset'
      },
      'slave_repl_offset': {
        'color': '#E24D42',
        'alias': '@instance.slave-repl-offset'
      }
    },
    'panel': {
      'title': 'Redis Replication Offset',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.redis.replLag = {
    'graph': {
      '/lag$/': {
        'alias': '@instance.@description'
      }
    },
    'panel': {
      'title': 'Redis Replication Lag',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };


  // collectd memcached plugin configuration
  plugins.memcache = new Plugin({ 'alias': 'mc' });

  plugins.memcache.memory = {
    'graph': {
      'used': {
        'color': '#447EBC',
        'alias': 'used'
      },
      'free': {
        'color': '#508642',
        'alias': 'free'
      }
    },
    'panel': {
      'title': 'Memcached Memomy',
      'yaxes': [ { 'format': 'bytes' }, {} ],
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };

  plugins.memcache.connections = {
    'graph': {
      'current': { 'type': 'memcached_connections' }
    },
    'panel': {
      'title': 'Memcached Connections',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.memcache.items = {
    'graph': {
      'current': { 'type': 'memcached_items' }
    },
    'panel': {
      'title': 'Memcached Items',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.memcache.commands = {
    'graph': {
      'flush': { 'apply': 'derivative' },
      'get': { 'apply': 'derivative' },
      'set': { 'apply': 'derivative' },
      'touch': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Memcached Commands',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.memcache.octets = {
    'graph': {
      'tx': {
        'color': '#447EBC',
        'apply': 'derivative'
      },
      'rx': {
        'color': '#508642',
        'math': '* -1',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Memcached Traffic',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'yaxes': [ { 'format': 'bps' }, {} ]
    }
  };

  plugins.memcache.operations = {
    'graph': {
      'hits': { 'apply': 'derivative' },
      'misses': { 'apply': 'derivative' },
      'evictions': { 'apply': 'derivative' },
      'incr_hits': { 'apply': 'derivative' },
      'decr_hits': { 'apply': 'derivative' },
      'incr_misses': { 'apply': 'derivative' },
      'decr_misses': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Memcached Operations',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.memcache.hits = {
    'graph': {
      'hitratio': { }
    },
    'panel': {
      'title': 'Memcached Hitratio',
      'yaxes': [ { 'format': 'percent' }, {} ]
    }
  };

  plugins.memcache.ps = {
    'graph': {
      'processes': { },
      'threads': { }
    },
    'panel': {
      'title': 'Memcached Process Stats',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.memcache.cpu = {
    'graph': {
      'syst': {
        'color': '#EAB839',
        'apply': 'derivative'
      },
      'user': {
        'color': '#508642',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Memcached CPU Time',
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };

  // collectd rabbitmq plugin configuration: https://github.com/kozdincer/rabbitmq_collectd_plugin
  plugins.rabbitmq = new Plugin({ 'alias': 'rmq' });

  plugins.rabbitmq.rates = {
    'graph': {
      'ack_rate': { 'alias': 'rate-ack' },
      'deliver_rate': { 'alias': 'rate-deliver' },
      'publish_rate': { 'alias': 'rate-publish' }
    },
    'panel': {
      'title': 'RabbitMQ Rates'
    }
  };

  plugins.rabbitmq.channels = {
    'graph': {
      'channels': { 'alias': 'channels' },
      'queues': { 'alias': 'queues' }
    },
    'panel': {
      'title': 'RabbitMQ Channels and Queues',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.rabbitmq.connections = {
    'graph': {
      'connections': { 'alias': 'connections' },
      'consumers': { 'alias': 'consumers' },
      'exchanges': { 'alias': 'exchanges' }
    },
    'panel': {
      'title': 'RabbitMQ Connections',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.rabbitmq.messages = {
    'graph': {
      'messages_total': { 'alias': 'messages-total' },
      'messages_unack': { 'alias': 'messages-unack' },
      'messages_ready': { 'alias': 'messages-ready' }
    },
    'panel': {
      'title': 'RabbitMQ Messages',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.rabbitmq.fd = {
    'graph': {
      'fd_total': {
        'color': '#508642',
        'alias': 'fd-total'
      },
      'fd_used': {
        'color': '#447EBC',
        'alias': 'fd-used'
      }
    },
    'panel': {
      'title': 'RabbitMQ File Descriptors',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.rabbitmq.memory = {
    'graph': {
      'mem_limit': {
        'color': '#508642',
        'alias': 'mem-limit'
      },
      'mem_used': {
        'color': '#447EBC',
        'alias': 'mem-used'
      }
    },
    'panel': {
      'title': 'RabbitMQ Memory',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.rabbitmq.proc = {
    'graph': {
      'proc_total': {
        'color': '#508642',
        'alias': 'proc-total'
      },
      'proc_used': {
        'color': '#447EBC',
        'alias': 'proc-used'
      }
    },
    'panel': {
      'title': 'RabbitMQ Proc',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.rabbitmq.sockets = {
    'graph': {
      'sockets_total': {
        'color': '#508642',
        'alias': 'sockets-total'
      },
      'sockets_used': {
        'color': '#447EBC',
        'alias': 'sockets-used'
      }
    },
    'panel': {
      'title': 'RabbitMQ Sockets',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };


  // collectd elasticsearch plugin configuration: https://github.com/phobos182/collectd-elasticsearch
  plugins.elasticsearch = new Plugin({ 'alias': 'es' });

  plugins.elasticsearch.http = {
    'graph': {
      'http.current_open': { 'alias': 'http-open' }
    },
    'panel': {
      'title': 'ElasticSearch HTTP Open',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.elasticsearch.transportCount = {
    'graph': {
      'transport.rx.count': {
        'apply': 'derivative',
        'alias': 'transport-rx'
      },
      'transport.tx.count': {
        'apply': 'derivative',
        'math': '* -1',
        'alias': 'transport-tx'
      }
    },
    'panel': {
      'title': 'ElasticSearch Transport Counters',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'yaxes': [ { 'format': 'pps' }, {} ]
    }
  };

  plugins.elasticsearch.transportSize = {
    'graph': {
      'transport.rx.size': {
        'alias': 'transport-rx',
        'apply': 'derivative'
      },
      'transport.tx.size': {
        'alias': 'transport-tx',
        'math': '* -1',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'ElasticSearch Transport Size',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'yaxes': [ { 'format': 'bps' }, {} ]
    }
  };

  plugins.elasticsearch.idxTimes = {
    'graph': {
      '/^indices\\..*time$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Indices Times',
      'yaxes': [ { 'format': 'ms' }, {} ]
    }
  };

  plugins.elasticsearch.idxTotals = {
    'graph': {
      '/^indices\\..*total$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Indices Totals',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.elasticsearch.idxDocs = {
    'graph': {
      '/^indices\\.docs\\./': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Indices Docs',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.elasticsearch.idxCacheEvictions = {
    'graph': {
      '/^indices\\.cache\\..*\\.eviction(s)?$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Indices Cache Evictions',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.elasticsearch.jvmHeapPercent = {
    'graph': {
      'jvm.mem.heap-used-percent': { 'alias': 'jvm-heap-used' }
    },
    'panel': {
      'title': 'ElasticSearch JVM Heap Usage',
      'yaxes': [ { 'format': 'percent' }, {} ]
    }
  };

  plugins.elasticsearch.jvmMemHeap = {
    'graph': {
      'jvm.mem.heap-committed': {
        'color': '#508642',
        'alias': 'jvm-heap-commited'
      },
      'jvm.mem.heap-used': {
        'color': '#447EBC',
        'alias': 'jvm-heap-used'
      }
    },
    'panel': {
      'title': 'ElasticSearch JVM Heap Memory Usage',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.elasticsearch.jvmMemNonHeap = {
    'graph': {
      'jvm.mem.non-heap-committed': {
        'color': '#508642',
        'alias': 'jvm-non-heap-commited'
      },
      'jvm.mem.non-heap-used': {
        'color': '#447EBC',
        'alias': 'jvm-non-heap-used'
      }
    },
    'panel': {
      'title': 'ElasticSearch JVM Non Heap Memory Usage',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.elasticsearch.jvmThreads = {
    'graph': {
      'jvm.threads.peak': { 'color': '#508642' },
      'jvm.threads.count': { 'color': '#447EBC' }
    },
    'panel': {
      'title': 'ElasticSearch JVM Threads',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.elasticsearch.jvmGCCount = {
    'graph': {
      'jvm.gc.old-count': { 'apply': 'derivative' },
      'jvm.gc.count': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch JVM GC Count',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.elasticsearch.jvmGCTime = {
    'graph': {
      'jvm.gc.old-time': { 'apply': 'derivative' },
      'jvm.gc.time': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch JVM GC Time',
      'yaxes': [ { 'format': 'ms' }, {} ]
    }
  };

  plugins.elasticsearch.threadPoolCompleted = {
    'graph': {
      '/^thread_pool\\..*completed$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Completed',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.elasticsearch.threadPoolRejected = {
    'graph': {
      '/^thread_pool\\..*rejected$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Rejected',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.elasticsearch.threadPoolAcrive = {
    'graph': {
      '/^thread_pool\\..*active$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Active',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.elasticsearch.threadPoolLargest = {
    'graph': {
      '/^thread_pool\\..*largest$/': { }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Largest',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.elasticsearch.threadPoolQueue = {
    'graph': {
      '/^thread_pool\\..*queue$/': { }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Queue',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.elasticsearch.threadPoolThread = {
    'graph': {
      '/^thread_pool\\..*threads$/': { }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Threads',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };


  // collectd nginx plugin
  plugins.nginx = new Plugin();

  plugins.nginx.requests = {
    'graph': {
      'nginx': {
        'apply': 'derivative',
        'alias': 'requests',
        'type': 'nginx_requests'
      }
    },
    'panel': {
      'title': 'Nginx Requests',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.nginx.connections = {
    'graph': {
      'accepted': {
        'color': '#1F78C1',
        'apply': 'derivative'
      },
      'handled': {
        'color': '#629E51',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Nginx Connections',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.nginx.connStates = {
    'graph': {
      'active': { },
      'reading': { },
      'waiting': { },
      'writing': { }
    },
    'panel': {
      'title': 'Nginx Connections States',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };


  // collectd apache plugin
  plugins.apache = new Plugin({ 'alias': 'apache' });

  plugins.apache.traffic = {
    'graph': {
      'apache_value': {
        'type': 'apache_bytes',
        'color': '#508642',
        'alias': 'tx',
        'apply': 'derivative',
        'math': '* 8'
      }
    },
    'panel': {
      'title': 'Apache Network Traffic',
      'yaxes': [ { 'format': 'bps' }, {} ]
    }
  };

  plugins.apache.connections = {
    'graph': {
      'apache_value': {
        'type': 'apache_connections',
        'color': '#00FF99',
        'alias': 'connections',
        'apply': 'max'
      }
    },
    'panel': {
      'title': 'Apache Connections',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.apache.idleWorkers = {
    'graph': {
      'apache_value': {
        'type': 'apache_idle_workers',
        'color': '#3636FF',
        'alias': 'idle_workers',
        'apply': 'max'
      }
    },
    'panel': {
      'title': 'Apache Idle Workers',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.apache.requests = {
    'graph': {
      'apache_value': {
        'type': 'apache_requests',
        'color': '#73E3EB',
        'alias': 'requests',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Apache Requests',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.apache.apacheScoreboard = {
    'graph': {
      'open': { 'color': '#FCE94F' },
      'starting': { 'color': '#FCAF3E' },
      'reading': { 'color': '#8AE234' },
      'keepalive': { 'color': '#729FCF' },
      'dnslookup': { 'color': '#AD7FA8' },
      'logging': { 'color': '#EF2929' },
      'finishing': { 'color': '#D3D7CF' },
      'idle_cleanup': { 'color': '2E3436' },
      'waiting': { 'color': '#4E9A06' },
      'closing': { 'color': '#CE5C00' },
      'sending': { 'color': '#C4A000' }
    },
    'panel': {
      'title': 'Apache Scoreboard',
      'yaxes': [ { 'format': 'short' }, {} ],
      'tooltip': { 'value_type': 'individual' }
    }
  };


  // collectd mysql plugin configuration
  plugins.mysql = new Plugin();
  plugins.mysql.config.multi = true;

  plugins.mysql.commands = {
    'graph': {
      '': {
        'apply': 'derivative',
        'type': 'mysql_commands'
      }
    },
    'panel': {
      'title': 'MySQL commands for @metric',
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mysql.handlers = {
    'graph': {
      '': {
        'apply': 'derivative',
        'type': 'mysql_handler'
      }
    },
    'panel': {
      'title': 'MySQL handlers for @metric',
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mysql.locks = {
    'graph': {
      'immediate': {
        'color': '#508642',
        'apply': 'derivative',
        'type': 'mysql_locks'
      },
      'waited': {
        'color': '#BF1B00',
        'apply': 'derivative',
        'type': 'mysql_locks'
      }
    },
    'panel': {
      'title': 'MySQL locks for @metric',
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'yaxes': [ { 'format': 'ops' }, {} ],
      'fill': 5
    }
  };

  plugins.mysql.select = {
    'graph': {
      'full_join': {
        'color': '#EAB839',
        'apply': 'derivative',
        'type': 'mysql_select'
      },
      'full_range_join': {
        'color': '#EF843C',
        'apply': 'derivative',
        'type': 'mysql_select'
      },
      '/range$/': {
        'color': '#6ED0E0',
        'apply': 'derivative',
        'type': 'mysql_select'
      },
      'range_check': {
        'color': '#1F78C1',
        'apply': 'derivative',
        'type': 'mysql_select'
      },
      'scan': {
        'color': '#E24D42',
        'apply': 'derivative',
        'type': 'mysql_select'
      }
    },
    'panel': {
      'title': 'MySQL select for @metric',
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'yaxes': [ { 'format': 'ops' }, {} ],
      'fill': 5
    }
  };

  plugins.mysql.sort = {
    'graph': {
      'merge_passes': {
        'color': '#EAB839',
        'apply': 'derivative',
        'type': 'mysql_sort'
      },
      'range': {
        'color': '#6ED0E0',
        'apply': 'derivative',
        'type': 'mysql_sort'
      },
      'rows': {
        'color': '#1F78C1',
        'apply': 'derivative',
        'type': 'mysql_sort'
      },
      'scan': {
        'color': '#E24D42',
        'apply': 'derivative',
        'type': 'mysql_sort'
      }
    },
    'panel': {
      'title': 'MySQL sort for @metric',
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'yaxes': [ { 'format': 'ops' }, {} ],
      'fill': 5
    }
  };

  plugins.mysql.threads = {
    'graph': {
      'cached': {
        'color': '#508642',
        'type': 'threads'
      },
      'connected': {
        'color': '#EAB839',
        'type': 'threads'
      },
      'running': {
        'color': '#890F02',
        'type': 'threads'
      },
      'created': {
        'color': '#2F575E',
        'apply': 'derivative',
        'type': 'total_threads'
      }
    },
    'panel': {
      'title': 'MySQL threads for @metric',
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'yaxes': [ { 'format': 'short' }, {} ],
    }
  };

  plugins.mysql.qcache = {
    'graph': {
      'qcache-hits': {
        'color': '#508642',
        'apply': 'derivative',
        'type': 'cache_result'
      },
      'qcache-inserts': {
        'color': '#6ED0E0',
        'apply': 'derivative',
        'type': 'cache_result'
      },
      'qcache-not_cached': {
        'color': '#EAB839',
        'apply': 'derivative',
        'type': 'cache_result'
      },
      'qcache-prunes': {
        'color': '#890F02',
        'apply': 'derivative',
        'type': 'cache_result'
      }
    },
    'panel': {
      'title': 'MySQL Query Cache for @metric',
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'yaxes': [ { 'format': 'ops' }, {} ],
      'fill': 5
    }
  };

  plugins.mysql.qcache_size = {
    'graph': {
      'qcache': {
        'color': '#1F78C1',
        'alias': 'queries',
        'type': 'cache_size'
      }
    },
    'panel': {
      'title': 'MySQL Query Cache Size for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.mysql.traffic = {
    'graph': {
      'rx': {
        'color': '#447EBC',
        'alias': 'rx',
        'apply': 'derivative',
        'math': '* -8',
        'type': 'mysql_octets'
      },
      'tx': {
        'color': '#508642',
        'alias': 'tx',
        'apply': 'derivative',
        'math': '* 8',
        'type': 'mysql_octets'
      }
    },
    'panel': {
      'title': 'MySQL Network Traffic on @metric',
      'yaxes': [ { 'format': 'bps' }, {} ],
      'grid': { 'max': null, 'min': null, 'leftMin': null }
    }
  };


  // collectd postgresql plugin configuration
  plugins.postgresql = new Plugin({ 'alias': 'psql' });
  plugins.postgresql.config.multi = true;

  plugins.postgresql.numBackends = {
    'graph': {
      'postgresql': { 'type': 'pg_numbackends' }
    },
    'panel': {
      'title': 'PostgreSQL Connected backends for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.postgresql.commitRollback = {
    'graph': {
      'postgresql': { 'type': 'pg_xact', 'apply': 'derivative' }
    },
    'panel': {
      'title': 'PostgreSQL Transactions for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.postgresql.ops = {
    'graph': {
      'postgresql': { 'type': 'pg_n_tup_c', 'apply': 'derivative' }
    },
    'panel': {
      'title': 'PostgreSQL Operations for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.postgresql.rows = {
    'graph': {
      'postgresql': { 'type': 'pg_n_tup_g', 'apply': 'derivative' }
    },
    'panel': {
      'title': 'PostgreSQL Rows for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.postgresql.idx = {
    'graph': {
      'idx': { 'type': 'pg_blks', 'apply': 'derivative' }
    },
    'panel': {
      'title': 'PostgreSQL Disk and Buffer Index Stats for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.postgresql.tidx = {
    'graph': {
      'tidx': { 'type': 'pg_blks', 'apply': 'derivative' }
    },
    'panel': {
      'title': 'PostgreSQL Disk and Buffer Stats for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.postgresql.dbSize = {
    'graph': {
      'postgresql': { 'type': 'pg_db_size', 'alias': 'size' }
    },
    'panel': {
      'title': 'PostgreSQL DB Size for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };


  // collectd zookeeper plugin configuration: https://github.com/signalfx/collectd-zookeeper
  plugins.zookeeper = new Plugin({ 'alias': 'zk' });
  plugins.zookeeper.config.multi = true;

  plugins.zookeeper.followers = {
    'graph': {
      'followers': { }
    },
    'panel': {
      'title': 'Zookeeper followers for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.zookeeper.conn = {
    'graph': {
      'connections': { }
    },
    'panel': {
      'title': 'Zookeeper connections for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.zookeeper.req = {
    'graph': {
      'requests': { 'apply': 'max' },
      'syncs': { 'apply': 'max' }
    },
    'panel': {
      'title': 'Zookeeper requests and syncs for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.zookeeper.watch = {
    'graph': {
      'watch_count': { 'apply': 'max' }
    },
    'panel': {
      'title': 'Zookeeper watches for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.zookeeper.leader = {
    'graph': {
      'is_leader': { 'apply': 'max' }
    },
    'panel': {
      'title': 'Zookeeper leader for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.zookeeper.nodes = {
    'graph': {
      'znode_count': { 'apply': 'max' },
      'ephemerals_count': { 'apply': 'max' }
    },
    'panel': {
      'title': 'Zookeeper nodes for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.zookeeper.data = {
    'graph': {
      'data_size': { }
    },
    'panel': {
      'title': 'Zookeeper data for @metric',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.zookeeper.files = {
    'graph': {
      'file_descriptor_count': { }
    },
    'panel': {
      'title': 'Zookeeper files for @metric',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.zookeeper.packets = {
    'graph': {
      'packets_sent': {
        'color': '#447EBC',
        'apply': 'derivative',
        'math': '* -1'
      },
      'packets_received': {
        'color': '#508642',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Zookeeper packets for @metric',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'yaxes': [ { 'format': 'pps' }, {} ]
    }
  };

  plugins.zookeeper.latency = {
    'graph': {
      'latency': { }
    },
    'panel': {
      'title': 'Zookeeper latency for @metric',
      'yaxes': [ { 'format': 'ms' }, {} ]
    }
  };


  // collectd mesos plugin configuration: https://github.com/rayrod2030/collectd-mesos
  plugins.mesos = new Plugin({ 'alias': 'mo' });

  plugins.mesos.cpus = {
    'graph': {
      '/(master|slave)_cpus_total/': { 'color': '#508642' },
      '/(master|slave)_cpus_used/': { 'color': '#447EBC' }
    },
    'panel': {
      'title': 'Mesos CPUs',
      'yaxes': [ { 'format': 'short' }, {} ],
      'fill': 5
    }
  };

  plugins.mesos.cpusPercent = {
    'graph': {
      'cpus_percent': { 'math': '* 100' }
    },
    'panel': {
      'title': 'Mesos CPUs percent',
      'yaxes': [ { 'format': 'percent' }, {} ],
      'fill': 5,
      'percentage': true
    }
  };

  plugins.mesos.load = {
    'graph': {
      'system_load': { }
    },
    'panel': {
      'title': 'Mesos System Load',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.mesos.memory = {
    'graph': {
      'mem_total': { 'color': '#508642' },
      'mem_used': { 'color': '#447EBC' }
    },
    'panel': {
      'title': 'Mesos Memory',
      'yaxes': [ { 'format': 'mbytes' }, {} ],
      'fill': 5
    }
  };

  plugins.mesos.memPercent = {
    'graph': {
      'mem_percent': { 'math': '* 100' }
    },
    'panel': {
      'title': 'Mesos Memory percent',
      'yaxes': [ { 'format': 'percent' }, {} ],
      'fill': 5,
      'percentage': true
    }
  };

  plugins.mesos.systemMem = {
    'graph': {
      'system_mem_total': { 'color': '#f08080' },
      'system_mem_free': { 'color': '#32cd32' }
    },
    'panel': {
      'title': 'Mesos System Memory',
      'yaxes': [ { 'format': 'bytes' }, {} ],
      'fill': 5
    }
  };

  plugins.mesos.disk = {
    'graph': {
      'disk_total': { 'color': '#508642' },
      'disk_used': { 'color': '#447EBC' }
    },
    'panel': {
      'title': 'Mesos Disk',
      'yaxes': [ { 'format': 'mbytes' }, {} ],
      'fill': 5
    }
  };

  plugins.mesos.diskPercent = {
    'graph': {
      'disk_percent': { 'math': '* 100' }
    },
    'panel': {
      'title': 'Mesos Disk percent',
      'yaxes': [ { 'format': 'percent' }, {} ],
      'fill': 5,
      'percentage': true
    }
  };

  plugins.mesos.uptime = {
    'graph': {
      'uptime_secs': { }
    },
    'panel': {
      'title': 'Mesos Uptime',
      'y_formats': [ 's' ],
      'fill': 5
    }
  };

  plugins.mesos.slaveRegistered = {
    'graph': {
      'slave_registered': { }
    },
    'panel': {
      'title': 'Mesos Slave registered',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.mesos.masterElected = {
    'graph': {
      'master_elected': { }
    },
    'panel': {
      'title': 'Mesos Master elected',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.mesos.slaveRecoveryErrors = {
    'graph': {
      'slave_recovery_errors': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos Slave recovery errors/sec',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mesos.tasksGauge = {
    'graph': {
      'tasks_running': { },
      'tasks_staging': { },
      'tasks_starting': { }
    },
    'panel': {
      'title': 'Mesos tasks states',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.mesos.statusUpdates = {
    'graph': {
      'status_updates': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos status updates/sec',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mesos.tasksCounter = {
    'graph': {
      'tasks_error': { 'apply': 'derivative' },
      'tasks_failed': { 'apply': 'derivative' },
      'tasks_finished': { 'apply': 'derivative' },
      'tasks_killed': { 'apply': 'derivative' },
      'tasks_lost': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos tasks results/sec',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mesos.frameworks = {
    'graph': {
      'frameworks_active': { 'apply': 'max' },
      'frameworks_inactive': { 'apply': 'max' },
      'frameworks_connected': { 'apply': 'max' },
      'frameworks_disconnected': { 'apply': 'max' }
    },
    'panel': {
      'title': 'Mesos frameworks status',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.mesos.slaveExecutors = {
    'graph': {
      'slave_executors': { 'type': 'gauge' }
    },
    'panel': {
      'title': 'Mesos Slave executors states',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.mesos.slaveFrameworkMsg = {
    'graph': {
      'framework_messages': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos framework messages/sec',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mesos.masterFmwExecMsg = {
    'graph': {
      'framework_to_executor_messages': { 'apply': 'derivative' },
      'messages_exited_executor': { 'apply': 'derivative' },
      'messages_framework_to_executor': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos framework executor messages/sec',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mesos.masterFmwMsg = {
    'graph': {
      '_register_framework': { 'apply': 'derivative' },
      '_reregister_framework': { 'apply': 'derivative' },
      '_unregister_framework': { 'apply': 'derivative' },
      '_deactivate_framework': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos framework messages/sec',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mesos.masterOpMsg = {
    'graph': {
      'messages_authenticate': { 'apply': 'derivative' },
      'messages_status_update': { 'apply': 'derivative' },
      'messages_status_update_acknowledgement': { 'apply': 'derivative' },
      '_valid_status_updates': { 'apply': 'derivative' },
      '_valid_status_update_acknowledgements': { 'apply': 'derivative' },
      '_invalid_status_updates': { 'apply': 'derivative' },
      '_invalid_status_update_acknowledgements': { 'apply': 'derivative' },
      'messages_resource_request': { 'apply': 'derivative' },
      'dropped_messages': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos operation messages/sec',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mesos.masterSlaveMsg = {
    'graph': {
      '_register_slave': { 'apply': 'derivative' },
      '_reregister_slave': { 'apply': 'derivative' },
      '_unregister_slave': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos slave messages/sec',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mesos.masterOfferMsg = {
    'graph': {
      'messages_decline_offers': { 'apply': 'derivative' },
      'messages_revive_offers': { 'apply': 'derivative' },
      'outstanding_offers': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos offer messages/sec',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mesos.masterTaskMsg = {
    'graph': {
      'messages_kill_task': { 'apply': 'derivative' },
      'messages_launch_tasks': { 'apply': 'derivative' },
      'messages_reconcile_tasks': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos task messages/sec',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mesos.masterSlaveOps = {
    'graph': {
      'master_slave_': { 'apply': 'derivative' },
      'recovery_slave_removals': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos slave operations/sec',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.mesos.masterSlaves = {
    'graph': {
      'master_slaves': { }
    },
    'panel': {
      'title': 'Mesos Master Slaves status',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.mesos.masterFwks = {
    'graph': {
      'master_frameworks': { }
    },
    'panel': {
      'title': 'Mesos Master Frameworks status',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.mesos.masterEventQueue = {
    'graph': {
      'master_event_queue': { }
    },
    'panel': {
      'title': 'Mesos Master Event Queue',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.mesos.masterRegStates = {
    'graph': {
      'registrar_state': { }
    },
    'panel': {
      'title': 'Mesos Master Registrar states',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.mesos.masterRegSize = {
    'graph': {
      'registrar_registry_size_bytes': { }
    },
    'panel': {
      'title': 'Mesos Master Registry size',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.mesos.masterRegQueue = {
    'graph': {
      'registrar_queued_operations': { }
    },
    'panel': {
      'title': 'Mesos Master Registry queued operations',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };


  // Plugin for collectd-IRQ. for more verbosity ,you need to confiugure 
  // it to your own needs. At the client machine, you do 
  // '$cat /proc/interrrups' 
  // and choose the interrups you need by number. 
  // Than you edit the 'graph' section. 
  // The commented example you can use, for more verbosity.
  plugins.irq = new Plugin();
  plugins.irq.config.multi = true;
  /*
  plugins.irq.perSec = {
    'graph': {
      '/^5$/': { 
        'color': '#E24D42',
        'alias': 'eth1',
        'apply': 'derivative(1s)'
      },
      '/^4$/': {
        'color': '#890F02',
        'alias': 'eth0',
        'apply': 'derivative(1s)'
      },
      '/^7$/': {
        'color': '#508642',
        'alias': 'timer',
        'apply': 'derivative(1s)'
      },
      '/^11$/': {
        'color': '#9400D3' ,
        'alias': 'serial',
        'apply': 'derivative(1s)'
      }
    },
    'panel': {
      'title': 'interrupts per second'
    }
  };
  */
  
  plugins.irq.genericPSec = {
    'graph': {
      '': {
        'apply': 'derivative(1s)'
      } 
      
    },
    'panel': {
      'title': 'generic interrupts pers second'
    }
  };


  // kafka GenericJMX plugin configuration
  plugins.kafka = new Plugin({ 'alias': 'kafka' });

  plugins.kafka.controller = {
    'graph': {
      'controller.active.gauge': {
        'alias': 'active'
      },
    },
    'panel': {
      'title': 'JMX Kafka Active Controllers',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.kafka.logFlush = {
    'graph': {
      'log.flush.count': {
        'apply': 'derivative(max)',
        'alias': 'flushes'
      },
    },
    'panel': {
      'title': 'JMX Kafka Log Flushes',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.kafka.logTime = {
    'graph': {
      'log.flush.time-ms.median': {
        'alias': 'flush-time-average',
        'color': '#CCA300'
      },
      'log.flush.time-ms.99th': {
        'alias': 'flush-time-most',
        'color': '#508642'
      }
    },
    'panel': {
      'title': 'JMX Kafka Log Flushes Time',
      'fill': 3,
      'yaxes': [ { 'format': 'ms' }, {} ]
    }
  };

  plugins.kafka.requestsCount = {
    'graph': {
      'requests.count': {
        'apply': 'derivative',
        'alias': 'requests'
      }
    },
    'panel': {
      'title': 'JMX Kafka Requests',
      'yaxes': [ { 'format': 'ops' }, {} ]
    }
  };

  plugins.kafka.totalTimeMedian = {
    'graph': {
      'total-time.median': {
        'alias': 'average-time'
      },
      'total-time.99th': {
        'alias': 'max-time'
      }
    },
    'panel': {
      'title': 'JMX Kafka Operation Times',
      'yaxes': [ { 'format': 'ms' }, {} ]
    }
  };

  plugins.kafka.messages = {
    'graph': {
      'topics.messages.count': {
        'apply': 'derivative',
        'alias': 'messages-count'
      }
    },
    'panel': {
      'title': 'JMX Kafka Topics Messages',
      'yaxes': [ { 'format': 'pps' }, {} ]
    }
  };

  plugins.kafka.traffic = {
    'graph': {
      'topics.bytes-out.count': {
        'color': '#447EBC',
        'apply': 'derivative',
        'alias': 'bytes-out'
      },
      'topics.bytes-in.count': {
        'color': '#508642',
        'math': '* -1',
        'apply': 'derivative',
        'alias': 'bytes-in'
      }
    },
    'panel': {
      'title': 'JMX Kafka Topics Traffic',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.kafka.partitionsUnderRepl = {
    'graph': {
      'partitions.underreplicated.gauge': {
        'alias': 'underreplicated-count'
      }
    },
    'panel': {
      'title': 'JMX Kafka Partitions Underreplicated',
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };


  // collectd docker plugin configuration: https://github.com/lebauce/docker-collectd-plugin
  plugins.docker = new Plugin();

  plugins.docker.cpuPercent = {
    'graph': {
      'docker': {
        'type': 'cpu.percent',
        'alias': 'usage'
      }
    },
    'panel': {
      'title': 'Docker CPU Percent',
      'yaxes': [ { 'format': 'percent' }, {} ]
    }
  };

  plugins.docker.cpuThrottling = {
    'graph': {
      'docker': {
        'type': 'cpu.throttling_data',
        'alias': 'data'
      }
    },
    'panel': {
      'title': 'Docker CPU Throttling',
      'stack': true,
      'yaxes': [ { 'format': 'short' }, {} ]
    }
  };

  plugins.docker.ioOps = {
    'graph': {
      'io_serviced': {
        'type': 'blkio',
        'apply': 'derivative',
        'alias': 'ops'
      }
    },
    'panel': {
      'title': 'Docker I/O Ops',
      'yaxes': [ { 'format': 'iops' }, {} ]
    }
  };

  plugins.docker.ioBytes = {
    'graph': {
      'io_service_bytes': {
        'type': 'blkio',
        'apply': 'derivative',
        'alias': 'bytes'
      }
    },
    'panel': {
      'title': 'Docker I/O Bytes',
      'yaxes': [ { 'format': 'bps' }, {} ]
    }
  };

  plugins.docker.networkUsage = {
    'graph': {
      'docker': {
        'type': 'network.usage',
        'apply': 'derivative',
        'alias': 'ops'
      }
    },
    'panel': {
      'title': 'Docker Network Usage',
      'yaxes': [ { 'format': 'bps' }, {} ]
    }
  };

  plugins.docker.memoryBytes = {
    'graph': {
      'docker': {
        'type': 'memory.usage',
        'alias': 'bytes'
      }
    },
    'panel': {
      'title': 'Docker Memory Usage',
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };

  plugins.docker.memoryDetail = {
    'graph': {
      '/^(?!total_|docker_|hierarchical_).+/': {
        'type': 'memory.stats',
        'alias': ''
      }
    },
    'panel': {
      'multi': true,
      'title': 'Docker Memory Usage for @metric',
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'yaxes': [ { 'format': 'bytes' }, {} ]
    }
  };


  return {
    'plugins': plugins
  };
}
