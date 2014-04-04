package org.projectodd.nodyn.process;

import static org.junit.Assert.*;

import java.util.Properties;

import org.junit.Test;

public class ProcessTest {

	@Test
	public void testLinuxPlatform() {
		Properties props = new Properties();
		props.setProperty("os.name", "Linux");
		props.setProperty("os.arch", "dummy");
		Process process = new Process(props);
		
		assertEquals("linux", process.platform());
	}
	
	@Test
	public void testDarwinPlatform() {
		Properties props = new Properties();
		props.setProperty("os.name", "Darwin");
		props.setProperty("os.arch", "dummy");
		Process process = new Process(props);
		
		assertEquals("darwin", process.platform());
	}
	
	@Test
	public void testMacPlatform() {
		Properties props = new Properties();
		props.setProperty("os.name", "Mac OS X");
		props.setProperty("os.arch", "dummy");
		Process process = new Process(props);
		
		assertEquals("darwin", process.platform());
	}
	
	@Test
	public void testFreeBSDPlatform() {
		Properties props = new Properties();
		props.setProperty("os.name", "FreeBSD");
		props.setProperty("os.arch", "dummy");
		Process process = new Process(props);
		
		assertEquals("freebsd", process.platform());
	}
	
	@Test
	public void testWindowsPlatform() {
		Properties props = new Properties();
		props.setProperty("os.name", "Windows 7");
		props.setProperty("os.arch", "dummy");
		Process process = new Process(props);
		
		assertEquals("win32", process.platform());
	}

	@Test
	public void testx386Arch() {
		Properties props = new Properties();
		props.setProperty("os.name", "dummy");
		props.setProperty("os.arch", "x86");
		Process process = new Process(props);
		
		assertEquals("ia32", process.arch());
	}
	
	@Test
	public void testi386Arch() {
		Properties props = new Properties();
		props.setProperty("os.name", "dummy");
		props.setProperty("os.arch", "i386");
		Process process = new Process(props);
		
		assertEquals("ia32", process.arch());
	}

	@Test
	public void testamd64Arch() {
		Properties props = new Properties();
		props.setProperty("os.name", "dummy");
		props.setProperty("os.arch", "amd64");
		Process process = new Process(props);
		
		assertEquals("x64", process.arch());
	}
	
	@Test
	public void testx86_64Arch() {
		Properties props = new Properties();
		props.setProperty("os.name", "dummy");
		props.setProperty("os.arch", "x86_64");
		Process process = new Process(props);
		
		assertEquals("x64", process.arch());
	}
	
	@Test
	public void testarmv41Arch() {
		Properties props = new Properties();
		props.setProperty("os.name", "dummy");
		props.setProperty("os.arch", "armv41");
		Process process = new Process(props);
		
		assertEquals("arm", process.arch());
	}
}
