---
title: Turn your old Android phone into a media center
layout: post
---

> If you have a non-smart TV with USB support and an Android phone, this will show you how to turn them into a poor man’s media center. It will include a torrent server with remote access and automatic torrent downloads, Samba and SSH.

In my case, I’m using a Samsung LE32E TV and an Alcatel OT-918 smartphone.

We'll work only with the phone, so you won’t have to change anything on the TV.

First, you need to make sure your device is rooted. See this guide for [rooting the Alcatel OT-918](http://forum.xda-developers.com/showthread.php?t=1748927).

Next up, if you’re also using an older phone with a smaller internal memory, you need a partitioned SD card, with a larger `ext2/3/4` partition and the rest as `FAT32`. I’m using a 32GB SD card with a 1GB `ext2` partition and the rest as `FAT32`. I definitely recommend using a class 10 SD card.

This means your Android kernel needs to have support for `ext` partitions.
See this [kernel with ext support for Alcatel OT-918](http://forum.xda-developers.com/showpost.php?p=42693393&postcount=239).

After you’ve partitioned your SD card, and made sure you have `ext` support in the kernel, use [Link2SD](https://play.google.com/store/apps/details?id=com.buak.Link2SD&hl=en) or something similar to mount the ext partition.

Then connect your phone to your WiFi router and set a static IP for it. If you’re using Android 2.3, go to `Settings > WiFi Settings > Advanced` and press `Use static IP`. Set the IP to something like `192.168.1.XX`.

## Optware for Android

We’ll start installing software on the phone. You’ll need to use a Linux system for this. Using a Live CD should also work.

[Optware](http://www.nslu2-linux.org/wiki/Optware/HomePage) is a lightweight package manager for Linux. We’ll install it on the phone and use it to get the rest of the packages we need.

Make sure you have `adb` installed. If you’re running Ubuntu you just need to install the `android-tools-adb` package.

Connect the device to your PC and, in a terminal, run:

```bash
sudo adb devices
```

Your device should show up in a list.

Download the [Optware package manager install script](https://github.com/pfalcon/optware-android/blob/master/optware-install-via-adb.sh).

If your Android device has a small internal memory, edit the `optware-install-via-adb.sh` script, and change the `OPTWARE_DIR` variable to point to an `/opt` folder on your mounted `ext` partition.
The variable should look like `OPTWARE_DIR=/data/sdext2/opt`.

Otherwise, if your device has plenty of internal memory, you can just leave the script as it is.

Now run the script with:

```bash 
./optware-install-via-adb.sh
```

This will install [Optware for Android](https://github.com/pfalcon/optware-android) on your device.

We now have a proper package manager on the device, so we’ll open a shell and start installing packages.

Connect to the `adb shell` and start the Optware shell with:

```bash 
adb shell
./data/sdext2/opt/start.sh
```

Now install everything related to Transmission (torrent server), FlexGet (automatic downloads), OpenSSH and Samba.

```bash 
ipkg update
ipkg install nano
ipkg install transmission

ipkg install openssh
ipkg install perl
ipkg install samba36

ipkg install gcc
ipkg install python26
ipkg install py26-setuptools

easy_install transmissionrpc
easy_install flexget # in case of easy_install error, edit opt/lib/python2.6/distutils/distutils.cfg

easy_install periscope # for subtitles

easy_install pip # just to be able to remove packages
```

Now that we installed the packages, we’ll start configuring them.

## Configure SSH

We’ll enable connecting by SSH using your public key. I’m assuming you already have your SSH keys set up on your system.

Edit the `/opt/etc/openssh/sshd_config` file, and set the `RSAAuthentication` and `PubkeyAuthentication` to:

```bash 
RSAAuthentication yes
PubkeyAuthentication yes
```

You can edit the file with Nano, since we installed it before:

```bash 
nano /opt/etc/openssh/sshd_config
```

Edit the `/opt/home/root/.ssh/authorized_keys` file, and paste the contents of your local public key file (`./pub`) in it.

Same as before, you can use Nano for this:

```bash 
nano /opt/home/root/.ssh/authorized_keys
```

Now restart OpenSSH with:

```bash 
/opt/etc/init.d/S40sshd
```

Sometimes when restarting OpenSSH, it will complain about the host key. If it does, create it with:

```bash 
ssh-keygen -t ecdsa -f /opt/etc/openssh/ssh_host_ecdsa_key -N ''
```

Exit the ADB shell, and you should now be able to get on the device using SSH:

```bash 
ssh root@192.168.1.X
```

Now that we have SSH, you can also log-in onto your device using something like [FileZilla](https://filezilla-project.org/) for easier file access.

## Configure Samba

I won’t go into much detail about the Samba config. Download my [smb.conf](https://github.com/ghinda/optware-mediacenter/blob/master/opt/etc/samba/smb.conf) file, and copy it into `/opt/etc/samba`.

Now restart Samba with

```bash 
/opt/etc/init.d/S08samba
```

and it should be working.

<p>
<del>
There is an issue with Samba that is preventing you from deleting any files on the device. I haven’t managed to figure out what the cause is yet. It’s possible that the old version of Samba packaged for Optware has this bug.
</del>
</p>

> On Ubuntu, mounting the Samba share with `cifs` fixes the issues with deleting files.

Add this to your `/etc/fstab` to mount the share with `cifs`:

```bash 
//192.168.1.X/sdcard /media/MOUNT_POINT cifs users,username=root,password="",rw,nounix,iocharset=utf8,file_mode=0777,dir_mode=0777 0 0
```

## Configure Transmission

Run the `transmission-daemon` first, then stop it, so it will create its config file.

```bash 
transmission-daemon
killall transmission-daemon
```

You can edit the config file at `opt/home/root/.config/transmission-daemon/settings.json`, or just use my [settings.json](https://github.com/ghinda/optware-mediacenter/blob/master/opt/home/root/.config/transmission-daemon/settings.json).

A good idea is to change the `download-dir` to point to the location you want it to download the torrents on the FAT32 SD card partition. Set the `rpc-enabled` property to `true`, to enable RPC and be able to connect to the web interface at `http://192.168.1.XX:9091/` or use the [Transmission Remote GUI](https://code.google.com/p/transmisson-remote-gui/).

These are both already done in my [settings.json](https://github.com/ghinda/optware-mediacenter/blob/master/opt/home/root/.config/transmission-daemon/settings.json) file.

Once you have the config set-up, start transmission with:

```bash 
transmission-daemon
```


## Configure FlexGet

[FlexGet](http://flexget.com/) is a multipurpose download automation tool. We’ll use it to automate downloads.

To configure Flexget, edit the `/opt/home/root/.flexget/config.yml` file. You can check out the [FlexGet Cookbook](http://flexget.com/wiki/Cookbook) for config file examples.

See [the Transmission config example](http://flexget.com/wiki/Cookbook/Series/AdvancedTransmissionAndDownloadManagement), to connect FlexGet to it, and have it add torrents automatically.

If you need automatic subtitle downloads, we installed Periscope before, so just follow the [FlexGet Periscope config](http://flexget.com/wiki/Plugins/periscope).

Now copy the [flexget.sh](https://github.com/ghinda/optware-mediacenter/blob/master/opt/flexget.sh) file to `/opt/flexget.sh`.

We’ll use this file to run the Flexget tasks. Flexget does have a `daemon` mode with a scheduler, but I noticed it’s a real memory hog, so I can’t use it.


## Configure autorun and scheduling

Copy [start.sh](https://github.com/ghinda/optware-mediacenter/blob/master/opt/start.sh) to `/opt/start.sh`. This script will run everything related to SSH, Samba and Transmission.

We need something that will run the script on startup and periodically run FlexGet. I’m using [Script Manager](https://play.google.com/store/apps/details?id=os.tools.scriptmanager&hl=en), since it can do both.

You need to set up the two scripts in Script Manager. Set `/opt/start.sh` to run on Boot and `/opt/flexget.sh` to run as often as you need it to check for new content (every 1 day/1 hour/etc.).


## Dual Mount

By default, when you connect the Phone to the TV with USB, all apps on the phone, including Transmission and FlexGet will not be able to access the SD card. To get around this, we have to use a `dual mount` app.

The app will mount the SD card on phone and the TV at the same time. This is usually not a good idea, since it will corrupt your SD card when doing simultaneous writes, but in this case the TV has read-only access, so it won’t happen.

I recommend using [Dual Mount SD Widget](https://play.google.com/store/apps/details?id=com.protocol.x.USB) since it’s the one that worked best for me.

You can also use something like [Multi Mount SD-Card Lite](https://play.google.com/store/apps/details?id=com.rafoid.multimountsdcard.widget.free) or similar.


##Extra tips

* My TV does not auto-refresh the contents on the SD card, so I have to turn it on and off to be able to see the newly added files in the USB interface.
* If you’re using an older phone, it’s best to free up as much memory as possible. So remove any apps you don’t need and use something like [Disable Service](https://play.google.com/store/apps/details?id=cn.wq.disableservice) to kill any extra services.
* After downloading lots of torrents on the SD card, even if it is a class 10, corruption will happen on the FAT32 partition. When it does, mount the SD card on your PC and run `sudo dosfsck -w -r -l -a -v -t /dev/sdc1` (replace `sdc1` with your SD card FAT32 partition) to try and fix the issues.

