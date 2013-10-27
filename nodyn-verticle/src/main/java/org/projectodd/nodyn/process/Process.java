package org.projectodd.nodyn.process;

import java.util.Properties;

public class Process {

	private final String osName;
	private final String osArch;

	public Process() {
		this(System.getProperties());
	}

	public Process(Properties props) {
		osName = props.getProperty("os.name").toLowerCase();
		osArch = props.getProperty("os.arch").toLowerCase();
	}

	/**
	 * http://nodejs.org/api/process.html#process_process_platform 'darwin',
	 * 'freebsd', 'linux', 'sunos' or 'win32'
	 * 
	 * @return
	 */
	public String platform() {
		if (isLinux()) {
			return "linux";
		} else if (isMac()) {
			return "darwin";
		} else if (isFreeBSD()) {
			return "freebsd";
		} else if (isSunos()) {
			return "sunos";
		} else if (isWindows()) {
			return "win32";
		}
		return null;
	}

	public boolean isLinux() {
		return osName.indexOf("linux") >= 0;
	}

	public boolean isMac() {
		return osName.indexOf("darwin") >= 0 || osName.indexOf("mac") >= 0;
	}

	public boolean isFreeBSD() {
		return osName.indexOf("freebsd") >= 0;
	}

	public boolean isSunos() {
		return osName.indexOf("sunos") >= 0;
	}

	public boolean isWindows() {
		return osName.indexOf("win") >= 0;
	}

	/**
	 * http://nodejs.org/api/process.html#process_process_arch 'arm', 'ia32', or
	 * 'x64'
	 * 
	 * @return
	 */
	public String arch() {
		if (isX64()) {
			return "x64";
		} else if (isIa32()) {
			return "ia32";
		} else if (isArm()) {
			return "arm";
		}
		return null;
	}

	public boolean isIa32() {
		return osArch.indexOf("x86") >= 0 || osArch.indexOf("i386") >= 0;
	}

	public boolean isX64() {
		return osArch.indexOf("amd64") >= 0 || osArch.indexOf("x86_64") >= 0;
	}

	public boolean isArm() {
		return osArch.indexOf("arm") >= 0;
	}

}
